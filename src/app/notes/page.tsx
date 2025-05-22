"use client";

import React from "react";

import { ContentList, ContentType } from "../_components/ContentComponent";

const NoteList: React.FC = () => (
    <ContentList
        apiPath="/api/notes"
        contentType={ContentType.Note}
        showBanner
    />
);

export default NoteList;
