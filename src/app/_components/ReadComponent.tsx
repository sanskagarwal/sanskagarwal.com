import React from "react";
import { ReadModel } from "../_models/ReadModel";
import { List } from "react-content-loader";
import readingTime from "reading-time";
import getHTML from "../_utils/MarkdownToHTML";
import SocialShare from "./SocialShare";
import Remark42 from "./Remark42";

const ReadComponent: React.FC<{
    error: string;
    isLoading: boolean;
    readModel: ReadModel | undefined;
}> = ({ error, isLoading, readModel }) => {
    return (
        <div className="grid grid-cols-6">
            <div
                className="py-4 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dotted
                    shadow-2xl md:shadow-lg"
            >
                {error && <div>Failed to load the model.</div>}
                {isLoading && (
                    <div>
                        <List />
                        <br />
                        <List />
                    </div>
                )}
                {readModel && (
                    <div>
                        <div className="ui text">
                            <h1 className="ui header">{readModel.title}</h1>
                            <p className="ui text-gray-600">
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
                )}
                <Remark42 />
            </div>
        </div>
    );
};

export default ReadComponent;
