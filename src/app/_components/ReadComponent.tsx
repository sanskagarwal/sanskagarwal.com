import React from "react";
import { ReadModel } from "../_models/ReadModel";
import readingTime from "reading-time";
import getHTML from "../_utils/MarkdownToHTML";
import SocialShare from "./SocialShare";
import Remark42 from "./Remark42";
import ReadingShell from "./ReadingShell";
import { Badge } from "./ui/Badge";

const ReadComponent: React.FC<{
    readModel: ReadModel;
}> = ({ readModel }) => {
    return (
        <ReadingShell>
            <header className="mb-6 border-b border-border pb-6">
                {readModel.category && (
                    <Badge className="mb-3">{readModel.category}</Badge>
                )}
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {readModel.title}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    {`${new Date(readModel.published_at).toLocaleDateString(
                        undefined,
                        {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                    )} · ${readingTime(readModel.content).text}`}
                </p>
            </header>
            {getHTML(readModel.content)}
            <SocialShare readModel={readModel} />
            <Remark42 />
        </ReadingShell>
    );
};

export default ReadComponent;
