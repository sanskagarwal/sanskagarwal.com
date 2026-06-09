import "server-only";

import { executeWithRetry } from "./RetryQuery";

type Row = Record<string, unknown>;

export interface ContentRepositoryConfig<T> {
    /** Table name (trusted, not user input). */
    table: string;
    /** Column used to look up a single record by its public URL slug. */
    urlColumn: string;
    /** Columns selected for list queries. */
    listColumns: string[];
    /** Columns selected for single-record queries. */
    detailColumns: string[];
    /** Maps a raw DB row to a typed domain model. */
    map: (row: Row) => T;
}

export interface ContentRepository<T> {
    findAll: () => Promise<T[]>;
    findByUrl: (url: string) => Promise<T | null>;
}

/** Shared base mapping for fields common to all content (blogs, notes). */
export const mapReadModelFields = (row: Row) => ({
    id: Number(row.id),
    title: String(row.title ?? ""),
    summary: String(row.summary ?? ""),
    category: String(row.category ?? ""),
    published_at: new Date(row.published_at as string),
    content: row.content != null ? String(row.content) : "",
});

export const createContentRepository = <T>(
    config: ContentRepositoryConfig<T>
): ContentRepository<T> => {
    const findAll = async (): Promise<T[]> => {
        try {
            const query = `
                SELECT ${config.listColumns.join(", ")}
                FROM ${config.table}
                WHERE published_at IS NOT NULL
                ORDER BY published_at DESC
            `;
            const rows = await executeWithRetry<Row[]>(query);
            return rows.map(config.map);
        } catch (err) {
            console.error(`Failed to fetch list from ${config.table}: ${err}`);
            return [];
        }
    };

    const findByUrl = async (url: string): Promise<T | null> => {
        if (!url) {
            return null;
        }
        try {
            const query = `
                SELECT ${config.detailColumns.join(", ")}
                FROM ${config.table}
                WHERE ${config.urlColumn} = $1 AND published_at IS NOT NULL
            `;
            const rows = await executeWithRetry<Row[]>(query, [url]);
            return rows[0] ? config.map(rows[0]) : null;
        } catch (err) {
            console.error(
                `Failed to fetch ${config.table} by ${config.urlColumn}=${url}: ${err}`
            );
            return null;
        }
    };

    return { findAll, findByUrl };
};
