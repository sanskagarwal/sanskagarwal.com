"use client";

import React from "react";
import useSWR from "swr";
import Markdown from "react-markdown";
import { Card, CardContent, Container } from "semantic-ui-react";
import { List } from "react-content-loader";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Blog } from "@/app/_models/Blog";

type Params = {
    url: string;
};

const BlogPage: React.FC<{ params: Params }> = ({ params }) => {
    const {
        data: blog,
        isLoading,
        error,
    } = useSWR<Blog>(`/api/blogs/${params.url}`, fetcher);

    return (
        <>
            {error && <div>Failed to load the blog</div>}
            {isLoading && (
                <Card>
                    <CardContent>
                        <List />
                    </CardContent>
                </Card>
            )}
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
