"use client";

import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Container } from "semantic-ui-react";

import { getBlog } from "@/app/_dataprovider/ClientBlogDataProvider";
import { Blog } from "@/app/_models/Blog";

type Params = {
    url: string;
};

const BlogPage: React.FC<{ params: Params }> = ({ params }) => {
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(() => {
        getBlog(params.url).then((data) => {
            setBlog(data);
        });
    }, [params.url]);

    return (
        <>
            {blog && (
                <Container text>
                    <h1>{blog.title}</h1>
                    <h4>{new Date(blog.published_at).toDateString()}</h4>
                    <Markdown>{blog.content}</Markdown>
                </Container>
            )}
        </>
    );
};

export default BlogPage;
