import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlog } from "@/app/_dataprovider/BlogDataProvider";
import ReadComponent from "@/app/_components/ReadComponent";

export const dynamic = "force-dynamic";

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
    };
}

const BlogPage = async ({ params }: { params: Promise<Params> }) => {
    const { url } = await params;
    const blog = await getBlog(url);

    if (!blog) {
        notFound();
    }

    return <ReadComponent readModel={blog} />;
};

export default BlogPage;
