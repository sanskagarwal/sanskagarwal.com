"use client";

import React from "react";

import { ContentList, ContentType } from "../_components/ContentComponent";

const BlogList: React.FC = () => (
    <ContentList apiPath="/api/blogs" contentType={ContentType.Blog} />
);

export default BlogList;
