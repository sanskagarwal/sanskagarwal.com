"use client";

import React, { useState } from "react";
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
} from "semantic-ui-react";

const NoteList: React.FC = () => {
    const {
        data: noteList,
        isLoading,
        error,
    } = useSWR<Note[]>("/api/notes", fetcher);

    const [loadingLinks, setLoadingLinks] = useState<{
        [key: string]: boolean;
    }>({});

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
                                        <CardMeta>
                                            {new Date(
                                                note.published_at
                                            ).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </CardMeta>
                                        <CardDescription>
                                            {note.summary}
                                        </CardDescription>
                                    </CardContent>
                                    <div className="ui bottom attached two buttons">
                                        <Link
                                            className="ui primary button"
                                            href={`/notes/${note.note_url}`}
                                            onClick={() => {
                                                setLoadingLinks((prev) => ({
                                                    ...prev,
                                                    [note.id.toString()]: true,
                                                }));
                                            }}
                                        >
                                            {loadingLinks[
                                                note.id.toString()
                                            ] ? (
                                                <i className="loading spinner icon" />
                                            ) : (
                                                "Read"
                                            )}
                                        </Link>
                                        <Link
                                            className="ui button"
                                            href={note.note_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View Original
                                        </Link>
                                    </div>
                                </Card>
                            );
                        })}
            </div>
        </div>
    );
};

export default NoteList;
