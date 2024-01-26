"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { BulletList } from "react-content-loader";
import Link from "next/link";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Blog } from "../_models/Blog";
import {
    Button,
    Card,
    CardContent,
    Label,
    SemanticCOLORS,
} from "semantic-ui-react";
import { Constants } from "../_utils/Constants";

const BlogList: React.FC = () => {
    const [activeLabel, setActiveLabel] = useState("all");
    const [labelColors, setLabelColors] = useState<{
        [key: string]: SemanticCOLORS;
    }>({});

    const {
        data: blogList,
        isLoading,
        error,
    } = useSWR<Blog[]>("/api/blogs", fetcher);

    useEffect(() => {
        const newLabelColors: { [key: string]: SemanticCOLORS } = {};
        newLabelColors["all"] = "red";
        let colorIndex = 1;
        blogList?.forEach((blog: Blog) => {
            if (!newLabelColors[blog.category]) {
                newLabelColors[blog.category] = Constants.COLORS[
                    colorIndex
                ] as SemanticCOLORS;
                colorIndex++;
            }
        });

        setLabelColors(newLabelColors);
    }, [blogList]);

    const changeActiveLabel = (e: any) => {
        setActiveLabel(e.target.innerText);
    };

    const createLabels = () => {
        return (
            <div>
                {Object.keys(labelColors).map((label: string) => {
                    return (
                        <Button
                            className="!py-1.5 !text-sm"
                            key={label}
                            as="a"
                            active={label === activeLabel}
                            onClick={changeActiveLabel}
                            inverted
                            color={labelColors[label]}
                        >
                            {label}
                        </Button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex gap-4 flex-col justify-center items-center">
            <p>Blogs</p>
            {error && <div>Failed to load blogs</div>}
            {isLoading && (
                <Card>
                    <CardContent>
                        <BulletList />
                    </CardContent>
                </Card>
            )}
            {labelColors && createLabels()}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-10">
                {blogList &&
                    blogList.map((blog: Blog) => {
                        if (
                            activeLabel !== "all" &&
                            blog.category !== activeLabel
                        ) {
                            return;
                        }

                        return (
                            <Card
                                className="ui card !m-0"
                                key={blog.id.toString()}
                            >
                                <CardContent className="!grow-0">
                                    <Label
                                        as="a"
                                        ribbon
                                        active={blog.category === activeLabel}
                                        onClick={changeActiveLabel}
                                        color={labelColors[blog.category]}
                                    >
                                        {blog.category}
                                    </Label>
                                    <span className="font-bold">
                                        {blog.title}
                                    </span>
                                </CardContent>
                                <CardContent description={blog.summary} />
                                <CardContent extra>
                                    <Link
                                        className="grid grid-cols-2 items-center"
                                        href={`/blog/${blog.blog_url}`}
                                    >
                                        <span>
                                            {new Date(
                                                blog.published_at
                                            ).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                        <span className="justify-self-end">
                                            Read
                                        </span>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
            </div>
        </div>
    );
};

export default BlogList;
