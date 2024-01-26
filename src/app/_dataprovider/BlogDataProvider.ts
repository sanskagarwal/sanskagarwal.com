import "server-only";

import mysql from "mysql2/promise";
import retry from "async-retry";

import { Blog } from "../_models/Blog";

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: {
        rejectUnauthorized: false,
    },
});

export const getBlogs = async (): Promise<Blog[]> => {
    try {
        return await retry(
            async (bail, attempt: Number) => {
                console.log(`Fetching list of blogs, attempt #${attempt}`);
                const [blogs] = await pool.execute<Blog[]>(
                    "SELECT * FROM `blogs` WHERE `published_at` IS NOT NULL"
                );
                console.log("Successfully fetched blogs");
                return blogs;
            },
            {
                retries: 3,
                onRetry: async (err: Error) => {
                    console.error(`Failed to fetch blog list, error: ${err}`);
                },
            }
        );
    } catch (err) {
        const msg = `Failed to fetch blogs after retries, error: ${err}`;
        console.error(msg);
        return [];
    }
};

export const getBlog = async (blogUrl: string): Promise<Blog | null> => {
    try {
        return await retry(
            async (bail, attempt: Number) => {
                console.log(`Fetching blog ${blogUrl}, attempt #${attempt}`);
                const [blog] = await pool.execute<Blog[]>(
                    "SELECT * FROM `blogs` WHERE `blog_url` = ? AND `published_at` IS NOT NULL",
                    [blogUrl]
                );
                console.log("Successfully fetched blog");
                return blog[0];
            },
            {
                retries: 3,
                onRetry: async (err: Error) => {
                    console.error(
                        `Failed to fetch blog ${blogUrl}, error: ${err}`
                    );
                },
            }
        );
    } catch (err) {
        const msg = `Failed to fetch blog ${blogUrl} after retries, error: ${err}`;
        console.error(msg);
        return null;
    }
};
