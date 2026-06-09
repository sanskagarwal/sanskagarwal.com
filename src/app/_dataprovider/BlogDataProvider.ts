import "server-only";

import { Blog } from "../_models/Blog";
import {
    createContentRepository,
    mapReadModelFields,
} from "./ContentRepository";

const mapBlog = (row: Record<string, unknown>): Blog => ({
    ...mapReadModelFields(row),
    blog_url: String(row.blog_url ?? ""),
});

const blogRepository = createContentRepository<Blog>({
    table: "blogs",
    urlColumn: "blog_url",
    listColumns: ["id", "title", "summary", "blog_url", "category", "published_at"],
    detailColumns: [
        "id",
        "title",
        "summary",
        "blog_url",
        "category",
        "published_at",
        "content",
    ],
    map: mapBlog,
});

export const getBlogs = (): Promise<Blog[]> => blogRepository.findAll();

export const getBlog = (blogUrl: string): Promise<Blog | null> =>
    blogRepository.findByUrl(blogUrl);
