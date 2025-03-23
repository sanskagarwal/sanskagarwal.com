"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { BulletList } from "react-content-loader";
import Link from "next/link";

import { Note } from "../_models/Note";
import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import {
    Card,
    CardContent,
    CardDescription,
    CardMeta,
    Label,
} from "semantic-ui-react";

const NoteList: React.FC = () => {
    const [loadingLinks, setLoadingLinks] = useState<{
        [key: string]: boolean;
    }>({});

    const {
        data: noteList,
        isLoading,
        error,
    } = useSWR<Note[]>("/api/notes", fetcher);

    return (
        <div className="p-4 flex gap-4 flex-col justify-center items-center">
            {error && <div>Failed to load notes</div>}
            {isLoading && (
                <Card>
                    <CardContent>
                        <BulletList />
                    </CardContent>
                </Card>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-10">
                {noteList &&
                    noteList
                        .sort(
                            (a, b) =>
                                new Date(b.published_at).getTime() -
                                new Date(a.published_at).getTime()
                        )
                        .map((note: Note) => {
                            return (
                                <Card
                                    className="ui card !m-0"
                                    key={note.id.toString()}
                                >
                                    <CardContent className="!grow-0">
                                        <span className="font-bold">
                                            {note.title}
                                        </span>
                                    </CardContent>
                                    <CardContent>
                                        <Link
                                            className="ui bottom attached button"
                                            href={`/notes/${note.note_url}`}
                                        >
                                            Read
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
            </div>
        </div>
    );
};

export default NoteList;
