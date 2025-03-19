import "server-only";

import retry from "async-retry";
import { Pool } from "pg";

const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    ssl: {
        rejectUnauthorized: false,
    },
});

export const executeWithRetry = async <T>(
    query: string,
    params: any[] = [],
    retries: number = 3
): Promise<T> => {
    return await retry(
        async (bail, attempt: number) => {
            console.log(`Executing query, attempt #${attempt}`);
            const client = await pool.connect();
            try {
                const res = await client.query(query, params);
                console.log("Query executed successfully");
                return res.rows as T;
            } finally {
                client.release(); // Ensure the client is released back to the pool
            }
        },
        {
            retries,
            onRetry: async (err: Error, attempt: number) => {
                console.error(
                    `Query failed on attempt #${attempt}, error: ${err}`
                );
            },
        }
    );
};
