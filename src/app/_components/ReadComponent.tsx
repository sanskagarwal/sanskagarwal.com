import React from "react";
import { ReadModel } from "../_models/ReadModel";
import readingTime from "reading-time";
import getHTML from "../_utils/MarkdownToHTML";
import SocialShare from "./SocialShare";
import Remark42 from "./Remark42";

const ReadComponent: React.FC<{
    readModel: ReadModel;
}> = ({ readModel }) => {
    return (
        <div className="grid grid-cols-6">
            <div
                className="py-4 bg-card text-card-foreground md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dotted border-border
                    shadow-2xl md:shadow-lg"
            >
                <div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {readModel.title}
                        </h1>
                        <p className="text-muted-foreground mb-4">
                            {`${new Date(
                                readModel.published_at
                            ).toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })} | ${readingTime(readModel.content).text}`}
                        </p>
                        {getHTML(readModel.content)}
                    </div>
                    <SocialShare readModel={readModel} />
                    <br />
                </div>
                <Remark42 />
            </div>
        </div>
    );
};

export default ReadComponent;
