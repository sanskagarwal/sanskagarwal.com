import type { MetadataRoute } from "next";

import { Constants } from "./_utils/Constants";
import { getBlogs } from "./_dataprovider/BlogDataProvider";
import { getNotes } from "./_dataprovider/NoteDataProvider";

export const dynamic = "force-dynamic";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const base = Constants.SITE_URI;

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
        { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${base}/notes`, changeFrequency: "weekly", priority: 0.6 },
        { url: `${base}/recipes`, changeFrequency: "weekly", priority: 0.6 },
        { url: `${base}/resume`, changeFrequency: "monthly", priority: 0.5 },
    ];

    const [blogs, notes] = await Promise.all([
        getBlogs().catch(() => []),
        getNotes().catch(() => []),
    ]);

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
        url: `${base}/blog/${blog.blog_url}`,
        lastModified: new Date(blog.published_at),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const noteRoutes: MetadataRoute.Sitemap = notes.map((note) => ({
        url: `${base}/notes/${note.note_url}`,
        lastModified: new Date(note.published_at),
        changeFrequency: "monthly",
        priority: 0.5,
    }));

    return [...staticRoutes, ...blogRoutes, ...noteRoutes];
};

export default sitemap;
