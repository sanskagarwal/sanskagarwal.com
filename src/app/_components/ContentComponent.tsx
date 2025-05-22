"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { BulletList } from "react-content-loader";
import Link from "next/link";
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
import { Blog } from "../_models/Blog";
import { Note } from "../_models/Note";

type Item = Blog & Note;

export enum ContentType {
    Note,
    Blog,
}

type ContentListProps = {
    apiPath: string;
    contentType: ContentType;
    showBanner?: boolean;
};

export const ContentList: React.FC<ContentListProps> = ({
    apiPath,
    contentType,
    showBanner = false,
}) => {
    const [activeLabel, setActiveLabel] = useState("all");
    const [labelColors, setLabelColors] = useState<{
        [key: string]: SemanticCOLORS;
    }>({});
    const [loadingLinks, setLoadingLinks] = useState<{
        [key: string]: boolean;
    }>({});

    const {
        data: itemList,
        isLoading,
        error,
    } = useSWR<Item[]>(apiPath, (url: string) =>
        fetch(url).then((res) => res.json())
    );

    useEffect(() => {
        let newLabelColors: { [key: string]: SemanticCOLORS } = {};
        let colorIndex = 1;
        itemList?.forEach((item: Item) => {
            if (!newLabelColors[item.category]) {
                newLabelColors[item.category] = Constants.COLORS[
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
    }, [itemList]);

    const changeActiveLabel = (e: any) => {
        setActiveLabel(e.target.innerText);
    };

    const createLabels = () => (
        <div>
            {Object.keys(labelColors).map((label: string) => (
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
            ))}
        </div>
    );

    return (
        <div className="p-4 flex gap-4 flex-col justify-center items-center">
            {showBanner && (
                <div className="w-full max-w-2xl mb-2">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded shadow-sm text-sm flex items-center gap-2">
                        <i className="info circle icon" aria-hidden="true"></i>
                        <span>
                            <strong>Note:</strong> The following notes are AI
                            converted. For the most accurate and complete
                            information, please check the original source.
                        </span>
                    </div>
                </div>
            )}
            {error && <div>Failed to load {contentType}s</div>}
            {isLoading && (
                <Card>
                    <CardContent>
                        <BulletList />
                    </CardContent>
                </Card>
            )}
            {labelColors && createLabels()}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-10">
                {itemList &&
                    itemList
                        .sort(
                            (a, b) =>
                                new Date(b.published_at).getTime() -
                                new Date(a.published_at).getTime()
                        )
                        .map((item: Item) => {
                            if (
                                activeLabel !== "all" &&
                                item.category !== activeLabel
                            ) {
                                return null;
                            }

                            return (
                                <Card
                                    className="ui card !m-0"
                                    key={item.id.toString()}
                                >
                                    <CardContent className="!grow-0">
                                        <Label
                                            as="a"
                                            ribbon
                                            active={
                                                item.category === activeLabel
                                            }
                                            onClick={changeActiveLabel}
                                            color={labelColors[item.category]}
                                        >
                                            {item.category}
                                        </Label>
                                        <span className="font-bold">
                                            {item.title}
                                        </span>
                                    </CardContent>
                                    <CardContent>
                                        <CardMeta>
                                            {new Date(
                                                item.published_at
                                            ).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </CardMeta>
                                        <CardDescription>
                                            {item.summary}
                                        </CardDescription>
                                    </CardContent>
                                    <div
                                        className={`ui bottom attached ${
                                            contentType === ContentType.Note
                                                ? "two"
                                                : ""
                                        } buttons`}
                                    >
                                        <Link
                                            className="ui primary button"
                                            href={`/${
                                                contentType === ContentType.Note
                                                    ? "notes"
                                                    : "blog"
                                            }/${
                                                contentType === ContentType.Note
                                                    ? item.note_url
                                                    : item.blog_url
                                            }`}
                                            onClick={() => {
                                                setLoadingLinks((prev) => ({
                                                    ...prev,
                                                    [item.id.toString()]: true,
                                                }));
                                            }}
                                        >
                                            {loadingLinks[
                                                item.id.toString()
                                            ] ? (
                                                <i className="loading spinner icon" />
                                            ) : (
                                                "Read"
                                            )}
                                        </Link>
                                        {contentType === ContentType.Note && (
                                            <Link
                                                className="ui button"
                                                href={item.note_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                View Original
                                            </Link>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
            </div>
        </div>
    );
};
