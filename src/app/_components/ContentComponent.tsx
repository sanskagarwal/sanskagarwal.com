"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    FaMagnifyingGlass,
    FaCircleInfo,
    FaSpinner,
    FaEllipsis,
    FaAnglesLeft,
    FaAnglesRight,
    FaAngleLeft,
    FaAngleRight,
} from "react-icons/fa6";
import { Constants } from "../_utils/Constants";
import { Blog } from "../_models/Blog";
import { Note } from "../_models/Note";
import { ContentType } from "../_models/ContentType";

type Item = Blog & Note;

const colorClasses: Record<string, { solid: string; outline: string }> = {
    red: {
        solid: "bg-red-500 text-white border-red-500",
        outline: "text-red-600 border-red-400 hover:bg-red-50",
    },
    pink: {
        solid: "bg-pink-500 text-white border-pink-500",
        outline: "text-pink-600 border-pink-400 hover:bg-pink-50",
    },
    blue: {
        solid: "bg-blue-500 text-white border-blue-500",
        outline: "text-blue-600 border-blue-400 hover:bg-blue-50",
    },
    green: {
        solid: "bg-green-600 text-white border-green-600",
        outline: "text-green-700 border-green-400 hover:bg-green-50",
    },
    violet: {
        solid: "bg-violet-500 text-white border-violet-500",
        outline: "text-violet-600 border-violet-400 hover:bg-violet-50",
    },
    purple: {
        solid: "bg-purple-500 text-white border-purple-500",
        outline: "text-purple-600 border-purple-400 hover:bg-purple-50",
    },
    orange: {
        solid: "bg-orange-500 text-white border-orange-500",
        outline: "text-orange-600 border-orange-400 hover:bg-orange-50",
    },
    brown: {
        solid: "bg-amber-700 text-white border-amber-700",
        outline: "text-amber-800 border-amber-500 hover:bg-amber-50",
    },
    yellow: {
        solid: "bg-yellow-500 text-white border-yellow-500",
        outline: "text-yellow-700 border-yellow-400 hover:bg-yellow-50",
    },
    olive: {
        solid: "bg-lime-600 text-white border-lime-600",
        outline: "text-lime-700 border-lime-400 hover:bg-lime-50",
    },
    teal: {
        solid: "bg-teal-500 text-white border-teal-500",
        outline: "text-teal-600 border-teal-400 hover:bg-teal-50",
    },
};

const getColor = (name?: string) => colorClasses[name ?? ""] ?? colorClasses.blue;

const getPageItems = (
    current: number,
    total: number
): (number | "ellipsis")[] => {
    if (total <= 1) return total === 1 ? [1] : [];
    const items: (number | "ellipsis")[] = [];
    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);
    items.push(1);
    if (left > 2) items.push("ellipsis");
    for (let p = left; p <= right; p++) items.push(p);
    if (right < total - 1) items.push("ellipsis");
    items.push(total);
    return items;
};

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
        [key: string]: string;
    }>({});
    const [loadingLinks, setLoadingLinks] = useState<{
        [key: string]: boolean;
    }>({});

    const itemList = items as Item[];

    useEffect(() => {
        const newLabelColors: { [key: string]: string } = {};
        let colorIndex = 1;
        itemList?.forEach((item: Item) => {
            if (!newLabelColors[item.category]) {
                newLabelColors[item.category] = Constants.COLORS[colorIndex];
                colorIndex++;
            }
            newLabelColors["all"] = "red";
        });

        const sortedLabelColors: { [key: string]: string } = {};
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

    const changeActiveLabel = (label: string) => {
        setActiveLabel(label);
        setCurrentPage(1);
    };

    const createLabels = () => (
        <div className="flex flex-wrap gap-2">
            {Object.keys(labelColors).map((label: string) => {
                const color = getColor(labelColors[label]);
                const isActive = label === activeLabel;
                return (
                    <button
                        className={`px-3 py-1.5 text-sm font-semibold rounded border capitalize transition-colors ${
                            isActive ? color.solid : color.outline
                        }`}
                        key={label}
                        onClick={() => changeActiveLabel(label)}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );

    const pageItems = getPageItems(currentPage, pageCount);

    return (
        <div className="p-4 flex gap-4 flex-col justify-center items-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                {labelColors && createLabels()}
                <div className="relative sm:w-64 w-full">
                    <FaMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>
            {showBanner && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded shadow-sm text-sm flex items-center gap-2">
                    <FaCircleInfo aria-hidden="true" />
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
                    const ribbon = getColor(labelColors[item.category]);
                    return (
                        <div
                            className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                            key={item.id.toString()}
                        >
                            <div className="p-4 pb-0">
                                <button
                                    onClick={() =>
                                        changeActiveLabel(item.category)
                                    }
                                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded text-white capitalize mb-2 ${ribbon.solid}`}
                                >
                                    {item.category}
                                </button>
                                <div className="font-bold">{item.title}</div>
                            </div>
                            <div className="p-4 grow">
                                <div className="text-sm text-gray-500 mb-1">
                                    {new Date(
                                        item.published_at
                                    ).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                                <div className="text-gray-700">
                                    {item.summary}
                                </div>
                            </div>
                            <div className="flex border-t border-gray-200">
                                <Link
                                    className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
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
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        "Read"
                                    )}
                                </Link>
                                {contentType === ContentType.Note && (
                                    <Link
                                        className="flex-1 flex items-center justify-center py-2 bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition-colors border-l border-gray-200"
                                        href={item.note_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Original
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {pageCount > 1 && (
                <nav className="mt-6 flex items-center gap-1">
                    <button
                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        aria-label="First page"
                    >
                        <FaAnglesLeft />
                    </button>
                    <button
                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        <FaAngleLeft />
                    </button>
                    {pageItems.map((item, idx) =>
                        item === "ellipsis" ? (
                            <span
                                key={`e${idx}`}
                                className="px-2 text-gray-400"
                            >
                                <FaEllipsis />
                            </span>
                        ) : (
                            <button
                                key={item}
                                onClick={() => setCurrentPage(item)}
                                className={`min-w-9 px-3 py-1.5 rounded text-sm font-semibold ${
                                    item === currentPage
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {item}
                            </button>
                        )
                    )}
                    <button
                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(pageCount, p + 1))
                        }
                        disabled={currentPage === pageCount}
                        aria-label="Next page"
                    >
                        <FaAngleRight />
                    </button>
                    <button
                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40"
                        onClick={() => setCurrentPage(pageCount)}
                        disabled={currentPage === pageCount}
                        aria-label="Last page"
                    >
                        <FaAnglesRight />
                    </button>
                </nav>
            )}
        </div>
    );
};
