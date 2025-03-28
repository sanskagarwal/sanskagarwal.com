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
    CardDescription,
    CardMeta,
    Label,
    SemanticCOLORS,
} from "semantic-ui-react";
import { Constants } from "../_utils/Constants";

const BlogList: React.FC = () => {
    const [activeLabel, setActiveLabel] = useState("all");
    const [labelColors, setLabelColors] = useState<{
        [key: string]: SemanticCOLORS;
    }>({});
    const [loadingLinks, setLoadingLinks] = useState<{
        [key: string]: boolean;
    }>({});

    const {
        data: blogList,
        isLoading,
        error,
    } = useSWR<Blog[]>("/api/blogs", fetcher);

    useEffect(() => {
        console.log(blogList);
        let newLabelColors: { [key: string]: SemanticCOLORS } = {};
        let colorIndex = 1;
        blogList?.forEach((blog: Blog) => {
            if (!newLabelColors[blog.category]) {
                newLabelColors[blog.category] = Constants.COLORS[
                    colorIndex
                ] as SemanticCOLORS;
                colorIndex++;
            }

            newLabelColors["all"] = "red";
        });

        const sortedLabelColors: { [key: string]: SemanticCOLORS } = {};
        Object.keys(newLabelColors)
            .sort()
            .forEach((key) => {
                sortedLabelColors[key] = newLabelColors[key];
            });

        setLabelColors(sortedLabelColors);
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
                            className="!py-1.5 !text-sm !font-semibold"
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
        <div className="p-4 flex gap-4 flex-col justify-center items-center">
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
                    blogList
                        .sort(
                            (a, b) =>
                                new Date(b.published_at).getTime() -
                                new Date(a.published_at).getTime()
                        )
                        .map((blog: Blog) => {
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
                                            active={
                                                blog.category === activeLabel
                                            }
                                            onClick={changeActiveLabel}
                                            color={labelColors[blog.category]}
                                        >
                                            {blog.category}
                                        </Label>
                                        <span className="font-bold">
                                            {blog.title}
                                        </span>
                                    </CardContent>
                                    <CardContent>
                                        <CardMeta>
                                            {new Date(
                                                blog.published_at
                                            ).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </CardMeta>
                                        <CardDescription>
                                            {blog.summary}
                                        </CardDescription>
                                    </CardContent>
                                    <Link
                                        className="ui bottom attached button"
                                        href={`/blog/${blog.blog_url}`}
                                        onClick={() => {
                                            setLoadingLinks((prev) => ({
                                                ...prev,
                                                [blog.id.toString()]: true,
                                            }));
                                        }}
                                    >
                                        {loadingLinks[blog.id.toString()] ? (
                                            <i className="loading spinner icon" />
                                        ) : (
                                            "Read"
                                        )}
                                    </Link>
                                </Card>
                            );
                        })}
            </div>
        </div>
    );
};

export default BlogList;
