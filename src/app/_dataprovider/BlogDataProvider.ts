import "server-only";

import { Blog } from "../_models/Blog";
import { executeWithRetry } from "./RetryQuery";

export const getBlogs = async (): Promise<Blog[]> => {
    console.log("Fetching list of blogs");
    try {
        const query = `
            SELECT id, title, summary, blog_url, category, published_at
            FROM blogs
            WHERE published_at IS NOT NULL
        `;
        return await executeWithRetry<Blog[]>(query);
    } catch (err) {
        const msg = `Failed to fetch blogs after retries, error: ${err}`;
        console.error(msg);
        return [];
    }
};

export const getBlog = async (blogUrl: string): Promise<Blog | null> => {
    if (!blogUrl) {
        return null;
    }

    console.log(`Fetching blog with URL: ${blogUrl}`);
    try {
        const query = `
            SELECT *
            FROM blogs
            WHERE blog_url = $1 AND published_at IS NOT NULL
        `;
        const result = await executeWithRetry<Blog[]>(query, [blogUrl]);
        return result[0] || null;
    } catch (err) {
        const msg = `Failed to fetch blog ${blogUrl} after retries, error: ${err}`;
        console.error(msg);
        return null;
    }
};
