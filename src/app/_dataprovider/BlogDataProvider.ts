import "server-only";

import mysql from "mysql2/promise";
import { cache } from "react";
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
        rejectUnauthorized: false
    }
});

export const getBlogs = cache(async (): Promise<Blog[]> => {
    const [blogs] = await pool.execute<Blog[]>(
        "SELECT * FROM `blogs` WHERE `published_at` IS NOT NULL"
    );
    return blogs;
});
