"use client";

import React from "react";
import useSWR from "swr";
import { List } from "react-content-loader";
import readingTime from "reading-time";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Note } from "@/app/_models/Note";
import getHTML from "@/app/_utils/MarkdownToHTML";
import Remark42 from "@/app/_components/Remark42";
import SocialShare from "@/app/_components/SocialShare";

type Params = {
    url: string;
};

const NotePage: React.FC<{ params: Params }> = ({ params }) => {
    const {
        data: note,
        isLoading,
        error,
    } = useSWR<Note>(`/api/notes/${params.url}`, fetcher);

    return (
        <div className="grid grid-cols-6">
            <div
                className="py-4 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dotted
                    shadow-2xl md:shadow-lg"
            >
                {error && <div>Failed to load the note.</div>}
                {isLoading && (
                    <div>
                        <List />
                        <br />
                        <List />
                    </div>
                )}
                {note && (
                    <div>
                        <div className="ui text">
                            <h1 className="ui header">{note.title}</h1>
                            <p className="ui text-gray-600">
                                {`${new Date(
                                    note.published_at
                                ).toLocaleDateString(undefined, {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })} | ${readingTime(note.content).text}`}
                            </p>
                            {getHTML(note.content)}
                        </div>
                        <br />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotePage;
