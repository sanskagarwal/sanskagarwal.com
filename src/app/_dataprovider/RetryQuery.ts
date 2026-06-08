import "server-only";

import retry from "async-retry";
import { Pool, type PoolConfig } from "pg";

const REQUIRED_ENV = [
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_NAME",
    "DATABASE_USERNAME",
    "DATABASE_PASSWORD",
] as const;

const buildPoolConfig = (): PoolConfig => {
    const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(
            `Missing required database environment variables: ${missing.join(", ")}`
        );
    }

    const sslDisabled = process.env.DATABASE_SSL === "false";
    const rejectUnauthorized =
        process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false";

    return {
        user: process.env.DATABASE_USERNAME,
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        password: process.env.DATABASE_PASSWORD,
        port: Number(process.env.DATABASE_PORT),
        ssl: sslDisabled
            ? false
            : {
                  rejectUnauthorized,
                  ca: process.env.DATABASE_CA_CERT,
              },
    };
};

let pool: Pool | undefined;

const getPool = (): Pool => {
    if (!pool) {
        pool = new Pool(buildPoolConfig());
    }
    return pool;
};

/** Postgres SQLSTATE / network codes worth retrying; everything else is deterministic. */
const RETRYABLE_CODES = new Set([
    "08000", // connection_exception
    "08001", // sqlclient_unable_to_establish_sqlconnection
    "08003", // connection_does_not_exist
    "08004", // sqlserver_rejected_establishment_of_sqlconnection
    "08006", // connection_failure
    "53300", // too_many_connections
    "53400", // configuration_limit_exceeded
    "57P03", // cannot_connect_now
    "40001", // serialization_failure
    "40P01", // deadlock_detected
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT",
    "EPIPE",
]);

const isRetryable = (err: unknown): boolean => {
    const code = (err as { code?: string })?.code;
    // Network-level failures without a SQLSTATE code are transient.
    if (!code) return true;
    return RETRYABLE_CODES.has(code);
};

export const executeWithRetry = async <T>(
    query: string,
    params: unknown[] = [],
    retries: number = 3
): Promise<T> => {
    return await retry(
        async (bail) => {
            const client = await getPool().connect();
            try {
                const res = await client.query(query, params);
                return res.rows as T;
            } catch (err) {
                if (!isRetryable(err)) {
                    bail(err as Error);
                    return undefined as T;
                }
                throw err;
            } finally {
                client.release();
            }
        },
        {
            retries,
            onRetry: (err: Error, attempt: number) => {
                console.error(
                    `Database query retry #${attempt}: ${err.message}`
                );
            },
        }
    );
};

