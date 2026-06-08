"use client";

import React, { useEffect, useMemo, useState } from "react";
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
    FaArrowUpRightFromSquare,
} from "react-icons/fa6";
import { Constants } from "../_utils/Constants";
import { cn } from "../_utils/cn";
import { Blog } from "../_models/Blog";
import { Note } from "../_models/Note";
import { ContentType } from "../_models/ContentType";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";

type Item = Blog & Note;

const colorClasses: Record<string, { solid: string; outline: string }> = {
    red: {
        solid: "bg-red-500 text-white border-red-500",
        outline: "text-red-600 dark:text-red-400 border-red-400 hover:bg-red-500/10",
    },
    pink: {
        solid: "bg-pink-500 text-white border-pink-500",
        outline: "text-pink-600 dark:text-pink-400 border-pink-400 hover:bg-pink-500/10",
    },
    blue: {
        solid: "bg-blue-500 text-white border-blue-500",
        outline: "text-blue-600 dark:text-blue-400 border-blue-400 hover:bg-blue-500/10",
    },
    green: {
        solid: "bg-green-600 text-white border-green-600",
        outline: "text-green-700 dark:text-green-400 border-green-400 hover:bg-green-500/10",
    },
    violet: {
        solid: "bg-violet-500 text-white border-violet-500",
        outline: "text-violet-600 dark:text-violet-400 border-violet-400 hover:bg-violet-500/10",
    },
    purple: {
        solid: "bg-purple-500 text-white border-purple-500",
        outline: "text-purple-600 dark:text-purple-400 border-purple-400 hover:bg-purple-500/10",
    },
    orange: {
        solid: "bg-orange-500 text-white border-orange-500",
        outline: "text-orange-600 dark:text-orange-400 border-orange-400 hover:bg-orange-500/10",
    },
    brown: {
        solid: "bg-amber-700 text-white border-amber-700",
        outline: "text-amber-800 dark:text-amber-500 border-amber-500 hover:bg-amber-700/10",
    },
    yellow: {
        solid: "bg-yellow-500 text-white border-yellow-500",
        outline: "text-yellow-700 dark:text-yellow-400 border-yellow-400 hover:bg-yellow-500/10",
    },
    olive: {
        solid: "bg-lime-600 text-white border-lime-600",
        outline: "text-lime-700 dark:text-lime-400 border-lime-400 hover:bg-lime-500/10",
    },
    teal: {
        solid: "bg-teal-500 text-white border-teal-500",
        outline: "text-teal-600 dark:text-teal-400 border-teal-400 hover:bg-teal-500/10",
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
    const [loadingLinks, setLoadingLinks] = useState<Record<string, boolean>>(
        {}
    );

    const itemList = items as Item[];
    const isNote = contentType === ContentType.Note;
    const heading = isNote ? "Notes" : "Blog";

    const labelColors = useMemo(() => {
        const colors: Record<string, string> = { all: "red" };
        let colorIndex = 1;
        itemList?.forEach((item) => {
            if (!colors[item.category]) {
                colors[item.category] =
                    Constants.COLORS[colorIndex % Constants.COLORS.length];
                colorIndex++;
            }
        });
        return Object.keys(colors)
            .sort()
            .reduce<Record<string, string>>((acc, key) => {
                acc[key] = colors[key];
                return acc;
            }, {});
    }, [itemList]);

    const filteredItems = useMemo(
        () =>
            (itemList ?? [])
                .filter(
                    (item) =>
                        item.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        item.summary
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                )
                .filter(
                    (item) =>
                        activeLabel === "all" || item.category === activeLabel
                )
                .sort(
                    (a, b) =>
                        new Date(b.published_at).getTime() -
                        new Date(a.published_at).getTime()
                ),
        [itemList, searchTerm, activeLabel]
    );

    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        if (currentPage > pageCount && pageCount > 0) setCurrentPage(1);
    }, [currentPage, pageCount]);

    const changeActiveLabel = (label: string) => {
        setActiveLabel(label);
        setCurrentPage(1);
    };

    const pageItems = getPageItems(currentPage, pageCount);

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
                <p
                    className="mt-1 text-sm text-muted-foreground"
                    role="status"
                    aria-live="polite"
                >
                    {filteredItems.length}{" "}
                    {filteredItems.length === 1 ? "entry" : "entries"}
                </p>
            </header>

            {showBanner && (
                <div className="mb-6 flex items-center gap-2 rounded-md border-l-4 border-yellow-400 bg-yellow-400/10 p-4 text-sm text-yellow-700 dark:text-yellow-300">
                    <FaCircleInfo aria-hidden="true" className="shrink-0" />
                    <span>
                        <strong>Note:</strong> The following notes are AI
                        converted. For the most accurate and complete
                        information, please check the original source.
                    </span>
                </div>
            )}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-label="Filter by category"
                >
                    {Object.keys(labelColors).map((label) => {
                        const color = getColor(labelColors[label]);
                        const isActive = label === activeLabel;
                        return (
                            <button
                                key={label}
                                onClick={() => changeActiveLabel(label)}
                                aria-pressed={isActive}
                                className={cn(
                                    "rounded border px-3 py-1.5 text-sm font-semibold capitalize transition-colors",
                                    isActive ? color.solid : color.outline
                                )}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
                <div className="relative w-full sm:w-64">
                    <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedItems.length === 0 && (
                    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <FaMagnifyingGlass className="h-5 w-5" />
                        </span>
                        <p className="text-muted-foreground">
                            No results found. Try a different search or category.
                        </p>
                        {(searchTerm || activeLabel !== "all") && (
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    changeActiveLabel("all");
                                }}
                                className="text-sm font-semibold text-primary hover:underline"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                )}
                {paginatedItems.map((item) => {
                    const ribbon = getColor(labelColors[item.category]);
                    const id = item.id.toString();
                    return (
                        <Card key={id} className="card-hover overflow-hidden">
                            <CardHeader>
                                <button
                                    onClick={() =>
                                        changeActiveLabel(item.category)
                                    }
                                    className={cn(
                                        "w-fit rounded px-2 py-0.5 text-xs font-semibold capitalize text-white",
                                        ribbon.solid
                                    )}
                                >
                                    {item.category}
                                </button>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="grow">
                                <p className="mb-1 text-sm text-muted-foreground">
                                    {new Date(
                                        item.published_at
                                    ).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="text-sm">{item.summary}</p>
                            </CardContent>
                            <CardFooter>
                                <Link
                                    className="flex h-11 flex-1 items-center justify-center bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                                    href={`/${isNote ? "notes" : "blog"}/${
                                        isNote ? item.note_url : item.blog_url
                                    }`}
                                    onClick={() =>
                                        setLoadingLinks((prev) => ({
                                            ...prev,
                                            [id]: true,
                                        }))
                                    }
                                >
                                    {loadingLinks[id] ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        "Read"
                                    )}
                                </Link>
                                {isNote && (
                                    <Link
                                        className="flex h-11 flex-1 items-center justify-center gap-1.5 border-l border-border bg-accent font-semibold text-accent-foreground transition-colors hover:bg-muted"
                                        href={item.note_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Original
                                        <FaArrowUpRightFromSquare className="text-xs" />
                                    </Link>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {pageCount > 1 && (
                <nav
                    className="mt-8 flex flex-col items-center gap-2"
                    aria-label="Pagination"
                >
                    <div className="flex flex-wrap items-center justify-center gap-1">
                    <button
                        className="rounded p-2 hover:bg-accent disabled:opacity-40"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        aria-label="First page"
                    >
                        <FaAnglesLeft />
                    </button>
                    <button
                        className="rounded p-2 hover:bg-accent disabled:opacity-40"
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
                                className="px-2 text-muted-foreground"
                            >
                                <FaEllipsis />
                            </span>
                        ) : (
                            <button
                                key={item}
                                onClick={() => setCurrentPage(item)}
                                aria-label={`Page ${item}`}
                                aria-current={
                                    item === currentPage ? "page" : undefined
                                }
                                className={cn(
                                    "min-w-9 rounded px-3 py-1.5 text-sm font-semibold",
                                    item === currentPage
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-accent"
                                )}
                            >
                                {item}
                            </button>
                        )
                    )}
                    <button
                        className="rounded p-2 hover:bg-accent disabled:opacity-40"
                        onClick={() =>
                            setCurrentPage((p) => Math.min(pageCount, p + 1))
                        }
                        disabled={currentPage === pageCount}
                        aria-label="Next page"
                    >
                        <FaAngleRight />
                    </button>
                    <button
                        className="rounded p-2 hover:bg-accent disabled:opacity-40"
                        onClick={() => setCurrentPage(pageCount)}
                        disabled={currentPage === pageCount}
                        aria-label="Last page"
                    >
                        <FaAnglesRight />
                    </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Page {currentPage} of {pageCount}
                    </p>
                </nav>
            )}
        </div>
    );
};
