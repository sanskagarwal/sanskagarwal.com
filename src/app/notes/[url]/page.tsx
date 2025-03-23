"use client";

import React from "react";
import useSWR from "swr";

import { fetcher } from "@/app/_dataprovider/ClientDataProvider";
import { Note } from "@/app/_models/Note";
import ReadComponent from "@/app/_components/ReadComponent";

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
        <ReadComponent error={error} isLoading={isLoading} readModel={note} />
    );
};

export default NotePage;
