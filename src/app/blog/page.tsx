import "server-only";

import React from "react";
import { getBlogs } from "../_dataprovider/BlogDataProvider";

export const revalidate = 3600; // revalidate every hour

const Blog: React.FC = async () => {
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
                        </div>
                    </div>
                )
            })}
        </>
    );
};

export default Blog;
