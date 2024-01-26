"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { BulletList } from "react-content-loader";
import Link from "next/link";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Blog } from "../_models/Blog";
import { Card, CardContent, Label } from "semantic-ui-react";

const BlogList: React.FC = () => {
    const [activeLabel, setActiveLabel] = useState("all");

    const {
        data: blogList,
        isLoading,
        error,
    } = useSWR<Blog[]>("/api/blogs", fetcher);

    const changeActiveLabel = (e: any) => {
        setActiveLabel(e.target.innerText);
    };

    const createLabels = (blogList: Blog[]) => {
        const labels: string[] = [];
        blogList.map((blog: Blog) => {
            if (!labels.includes(blog.category)) {
                labels.push(blog.category);
            }
        });

        labels.push("all");
        labels.sort();

        return (
            <div>
                {labels.map((label: string) => {
                    return (
                        <Label key={label} as="a" active={label === activeLabel} onClick={changeActiveLabel}>
                            {label}
                        </Label>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <p>Blogs</p>
            {error && <div>Failed to load blogs</div>}
            {isLoading && (
                <Card>
                    <CardContent>
                        <BulletList />
                    </CardContent>
                </Card>
            )}
            {blogList && createLabels(blogList)}
            {blogList &&
                blogList.map((blog: Blog) => {
                    if (activeLabel !== "all" && blog.category !== activeLabel) {
                        return;
                    }

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
