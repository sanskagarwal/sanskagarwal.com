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
    SemanticCOLORS,
} from "semantic-ui-react";
import { Constants } from "../_utils/Constants";

const NoteList: React.FC = () => {
    const [labelColors, setLabelColors] = useState<{
        [key: string]: SemanticCOLORS;
    }>({});
    const [loadingLinks, setLoadingLinks] = useState<{
        [key: string]: boolean;
    }>({});
    const {
        data: noteList,
        isLoading,
        error,
    } = useSWR<Note[]>("/api/notes", fetcher);

    useEffect(() => {
        console.log(noteList);
        let newLabelColors: { [key: string]: SemanticCOLORS } = {};
        let colorIndex = 1;
        noteList?.forEach((blog: Note) => {
            if (!newLabelColors[blog.category]) {
                newLabelColors[blog.category] = Constants.COLORS[
                    colorIndex
                ] as SemanticCOLORS;
                colorIndex++;
            }
        });

        const sortedLabelColors: { [key: string]: SemanticCOLORS } = {};
        Object.keys(newLabelColors)
            .sort()
            .forEach((key) => {
                sortedLabelColors[key] = newLabelColors[key];
            });

        setLabelColors(sortedLabelColors);
    }, [noteList]);

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
                                        <Label
                                            as="a"
                                            ribbon
                                            color={labelColors[note.category]}
                                        >
                                            {note.category}
                                        </Label>
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
