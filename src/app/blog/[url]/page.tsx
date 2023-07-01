import "server-only";

import React from "react";

import { getBlog } from "@/app/_dataprovider/BlogDataProvider";

export const revalidate = 3600; // revalidate every hour

type Params = {
    url: string;
};

const BlogPage: React.FC<{ params: Params }> = async ({ params }) => {
    const blog = await getBlog(params.url);
    return (
        <>
            {blog && (
                <div>
                    <h1>{blog.title}</h1>
                    <h4>{blog.published_at.toDateString()}</h4>
                    <p>{blog.content}</p>
                </div>
            )}
        </>
    );
};

export default BlogPage;
