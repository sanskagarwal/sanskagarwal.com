import { RowDataPacket } from "mysql2";

export interface Blog extends RowDataPacket {
    id: Number;
    blog_url: string;
    title: string;
    published_at: Date;
    content: string;
    summary: string;
    category: string;
};
