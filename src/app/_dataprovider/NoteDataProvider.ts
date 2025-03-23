import "server-only";

import { executeWithRetry } from "./RetryQuery";
import { Note } from "../_models/Note";

export const getNotes = async (): Promise<Note[]> => {
    console.log("Fetching list of notes");
    try {
        const query = `
            SELECT id, title, summary, note_url, note_link, category, published_at
            FROM notes
            WHERE published_at IS NOT NULL
        `;
        return await executeWithRetry<Note[]>(query);
    } catch (err) {
        const msg = `Failed to fetch notes after retries, error: ${err}`;
        console.error(msg);
        return [];
    }
};

export const getNote = async (noteUrl: string): Promise<Note | null> => {
    if (!noteUrl) {
        return null;
    }

    console.log(`Fetching note with URL: ${noteUrl}`);
    try {
        const query = `
            SELECT *
            FROM notes
            WHERE note_url = $1 AND published_at IS NOT NULL
        `;
        const result = await executeWithRetry<Note[]>(query, [noteUrl]);
        return result[0] || null;
    } catch (err) {
        const msg = `Failed to fetch note ${noteUrl} after retries, error: ${err}`;
        console.error(msg);
        return null;
    }
};
