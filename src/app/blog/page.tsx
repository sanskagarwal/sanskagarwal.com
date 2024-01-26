"use client";

import React from "react";
import useSWR from "swr";
import { BulletList } from "react-content-loader";
import Link from "next/link";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Blog } from "../_models/Blog";
import { Card, CardContent } from "semantic-ui-react";

const BlogList: React.FC = () => {
    const {
        data: blogList,
        isLoading,
        error,
    } = useSWR<Blog[]>("/api/blogs", fetcher);

    return (
        <>
            <p>List of Blogs</p>
            {error && <div>Failed to load blogs</div>}
            {isLoading && (
                <Card>
                    <CardContent>
                        <BulletList />
                    </CardContent>
                </Card>
            )}
            {blogList &&
                blogList.map((blog: Blog) => {
                    return (
                        <div key={blog.id.toString()} className="ui card">
                            <div className="content">
                                <div className="header">{blog.title}</div>
                                <div className="meta">{blog.category}</div>
                                <div className="description">
                                    {blog.summary}
                                </div>
                                <button className="ui button">
                                    <Link href={`/blog/${blog.blog_url}`}>
                                        here
                                    </Link>
                                </button>
                            </div>
                        </div>
                    );
                })}
        </>
    );
};

export default BlogList;
