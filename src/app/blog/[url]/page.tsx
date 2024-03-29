"use client";

import React from "react";
import useSWR from "swr";
import { List } from "react-content-loader";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Blog } from "@/app/_models/Blog";
import getHTML from "@/app/_utils/MarkdownToHTML";

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
        <div className="grid grid-cols-6">
            <div
                className="py-4 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dashed shadow-indigo-500/50
                    shadow-md md:shadow-lg"
            >
                {error && <div>Failed to load the blog.</div>}
                {isLoading && (
                    <div>
                        <List />
                        <br />
                        <List />
                    </div>
                )}
                {blog && (
                    <div className="ui text">
                        <h1 className="ui header">{blog.title}</h1>
                        <h6 className="ui header">
                            {new Date(blog.published_at).toLocaleDateString(
                                undefined,
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }
                            )}
                        </h6>
                        {getHTML(blog.content)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
