import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlog } from "@/app/_dataprovider/BlogDataProvider";
import ReadComponent from "@/app/_components/ReadComponent";

export const revalidate = 3600;

type Params = {
    url: string;
};

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { url } = await params;
    const blog = await getBlog(url);

    if (!blog) {
        return { title: "Not Found" };
    }

    return {
        title: blog.title,
        description: blog.summary,
        alternates: { canonical: `/blog/${url}` },
        openGraph: {
            type: "article",
            title: blog.title,
            description: blog.summary,
            url: `/blog/${url}`,
            publishedTime: new Date(blog.published_at).toISOString(),
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.summary,
        },
    };
}

const BlogPage = async ({ params }: { params: Promise<Params> }) => {
    const { url } = await params;
    const blog = await getBlog(url);

    if (!blog) {
        notFound();
    }

    return (
        <ReadComponent
            readModel={blog}
            backHref="/blog"
            backLabel="All posts"
            canonicalPath={`/blog/${url}`}
        />
    );
};

export default BlogPage;
