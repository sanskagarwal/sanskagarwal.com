"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardMeta,
    Label,
    SemanticCOLORS,
    Input,
    Pagination,
    Icon,
} from "semantic-ui-react";
import { Constants } from "../_utils/Constants";
import { Blog } from "../_models/Blog";
import { Note } from "../_models/Note";
import { ContentType } from "../_models/ContentType";

type Item = Blog & Note;

type ContentListProps = {
    items: (Blog | Note)[];
    contentType: ContentType;
    showBanner?: boolean;
};

export const ContentList: React.FC<ContentListProps> = ({
    items,
    contentType,
    showBanner = false,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [activeLabel, setActiveLabel] = useState("all");
    const [labelColors, setLabelColors] = useState<{
        [key: string]: SemanticCOLORS;
    }>({});
    const [loadingLinks, setLoadingLinks] = useState<{
        [key: string]: boolean;
    }>({});

    const itemList = items as Item[];

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

    const filteredItems = itemList
        ? itemList
              .filter(
                  (item) =>
                      item.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                      item.summary
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
              )
              .filter((item) => {
                  if (activeLabel === "all") return true;
                  return item.category === activeLabel;
              })
              .sort(
                  (a, b) =>
                      new Date(b.published_at).getTime() -
                      new Date(a.published_at).getTime()
              )
        : [];

    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (_: any, data: any) => {
        setCurrentPage(data.activePage);
    };

    const changeActiveLabel = (e: any) => {
        setActiveLabel(e.target.innerText);
        setCurrentPage(1);
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                {labelColors && createLabels()}
                <Input
                    icon="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="sm:w-64 w-full"
                />
            </div>
            {showBanner && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded shadow-sm text-sm flex items-center gap-2">
                    <i className="info circle icon" aria-hidden="true"></i>
                    <span>
                        <strong>Note:</strong> The following notes are AI
                        converted. For the most accurate and complete
                        information, please check the original source.
                    </span>
                </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-10">
                {paginatedItems.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        No results found.
                    </div>
                )}
                {paginatedItems.map((item: Item) => {
                    return (
                        <Card className="ui card !m-0" key={item.id.toString()}>
                            <CardContent className="!grow-0">
                                <Label
                                    as="a"
                                    ribbon
                                    active={item.category === activeLabel}
                                    onClick={changeActiveLabel}
                                    color={labelColors[item.category]}
                                >
                                    {item.category}
                                </Label>
                                <span className="font-bold">{item.title}</span>
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
                                    {loadingLinks[item.id.toString()] ? (
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
            <Pagination
                activePage={currentPage}
                totalPages={pageCount}
                onPageChange={handlePageChange}
                className="mt-6"
                siblingRange={1}
                ellipsisItem={{
                    content: <Icon name="ellipsis horizontal" />,
                    icon: true,
                }}
                firstItem={{
                    content: <Icon name="angle double left" />,
                    icon: true,
                }}
                lastItem={{
                    content: <Icon name="angle double right" />,
                    icon: true,
                }}
                prevItem={{
                    content: <Icon name="angle left" />,
                    icon: true,
                }}
                nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                }}
            />
        </div>
    );
};
