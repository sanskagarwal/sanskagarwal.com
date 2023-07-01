import { RowDataPacket } from "mysql2";

export interface Blog extends RowDataPacket {
    id: Number;
    url: string;
    title: string;
    publishedAt: Date;
    content: string;
    summary: string;
    category: string;
};
