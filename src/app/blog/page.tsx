"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogs } from "@/app/_dataprovider/ClientBlogDataProvider";
import { Blog } from "../_models/Blog";

const BlogList: React.FC = () => {
    const [blogList, setBlogList] = useState<[Blog]>();

    useEffect(() => {
        getBlogs().then((data) => {
            setBlogList(data);
        });
    }, []);

    return (
        <>
            <p>List of Blogs</p>
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
