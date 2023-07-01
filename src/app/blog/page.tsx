import "server-only";

import React from "react";
import Link from "next/link";
import { getBlogs } from "../_dataprovider/BlogDataProvider";

export const revalidate = 3600; // revalidate every hour

const BlogList: React.FC = async () => {
    const blogs = await getBlogs();
    return (
        <>
            <p>List of Blogs</p>
            {blogs.map((blog) => {
                return (
                    <div key={blog.id.toString()} className="ui card">
                        <div className="content">
                            <div className="header">{blog.title}</div>
                            <div className="meta">{blog.category}</div>
                            <div className="description">{blog.summary}</div>
                            <button className="ui button">
                                <Link href={`/blog/${blog.blog_url}`}>here</Link>
                            </button>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default BlogList;
