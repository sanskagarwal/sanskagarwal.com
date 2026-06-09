import "server-only";

import { Note } from "../_models/Note";
import {
    createContentRepository,
    mapReadModelFields,
} from "./ContentRepository";

const mapNote = (row: Record<string, unknown>): Note => ({
    ...mapReadModelFields(row),
    note_url: String(row.note_url ?? ""),
    note_link: String(row.note_link ?? ""),
});

const noteRepository = createContentRepository<Note>({
    table: "notes",
    urlColumn: "note_url",
    listColumns: [
        "id",
        "title",
        "summary",
        "note_url",
        "note_link",
        "category",
        "published_at",
    ],
    detailColumns: [
        "id",
        "title",
        "summary",
        "note_url",
        "note_link",
        "category",
        "published_at",
        "content",
    ],
    map: mapNote,
});

export const getNotes = (): Promise<Note[]> => noteRepository.findAll();

export const getNote = (noteUrl: string): Promise<Note | null> =>
    noteRepository.findByUrl(noteUrl);
