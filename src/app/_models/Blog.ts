import { RowDataPacket } from "mysql2";

export interface Blog extends RowDataPacket {
    id: Number;
    url: string;
    title: string;
    published_at: Date;
    content: string;
    summary: string;
    category: string;
};
