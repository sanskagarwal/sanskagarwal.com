"use client";

import React from "react";
import useSWR from "swr";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Blog } from "@/app/_models/Blog";
import ReadComponent from "@/app/_components/ReadComponent";

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
        <ReadComponent readModel={blog} isLoading={isLoading} error={error} />
    );
};

export default BlogPage;
