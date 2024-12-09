import "server-only";

import { Pool } from "pg";
import retry from "async-retry";

import { Blog } from "../_models/Blog";

const pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: Number(process.env.DATABASE_PORT),
    ssl: { rejectUnauthorized: false }, // Adjust SSL settings as needed
    max: 10,
    idleTimeoutMillis: 60000,
});

export const getBlogs = async (): Promise<Blog[]> => {
    try {
        return await retry(
            async (bail, attempt: Number) => {
                console.log(`Fetching list of blogs, attempt #${attempt}`);
                const client = await pool.connect();
                const res = await client.query(
                    "SELECT id, title, summary, blog_url, category, published_at FROM blogs WHERE published_at IS NOT NULL"
                );
                console.log("Successfully fetched blogs");
                return res.rows;
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
                const client = await pool.connect();
                const res = await pool.query(
                    "SELECT * FROM blogs WHERE blog_url = $1 AND published_at IS NOT NULL",
                    [blogUrl]
                );
                console.log("Successfully fetched blog");
                return res.rows[0];
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
