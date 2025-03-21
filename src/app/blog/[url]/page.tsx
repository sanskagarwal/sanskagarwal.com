"use client";

import React from "react";
import useSWR from "swr";
import { List } from "react-content-loader";
import readingTime from "reading-time";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Blog } from "@/app/_models/Blog";
import getHTML from "@/app/_utils/MarkdownToHTML";
import Remark42 from "@/app/_components/Remark42";
import SocialShare from "@/app/_components/SocialShare";

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
                className="py-4 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dotted
                    shadow-2xl md:shadow-lg"
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
                    <div>
                        <div className="ui text">
                            <h1 className="ui header">{blog.title}</h1>
                            <p className="ui text-gray-600">
                                {`${new Date(
                                    blog.published_at
                                ).toLocaleDateString(undefined, {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })} | ${readingTime(blog.content).text}`}
                            </p>
                            {getHTML(blog.content)}
                        </div>
                        <SocialShare blog={blog} />
                        <br />
                    </div>
                )}
                <Remark42 />
            </div>
        </div>
    );
};

export default BlogPage;
