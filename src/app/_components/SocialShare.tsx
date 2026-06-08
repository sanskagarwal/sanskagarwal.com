"use client";

import React, { useEffect, useState } from "react";
import {
    EmailIcon,
    EmailShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    RedditIcon,
    RedditShareButton,
    TwitterShareButton,
    XIcon,
} from "react-share";

import { ReadModel } from "../_models/ReadModel";

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({
    content,
    children,
}) => (
    <span className="relative inline-flex group">
        {children}
        <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            {content}
        </span>
    </span>
);

const SocialShare: React.FC<{ readModel: ReadModel }> = ({ readModel }) => {
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return (
        <div className="text-center p-4 my-6 border border-border rounded-lg">
            <h4 className="text-lg font-semibold mb-3">Share this</h4>
            <div className="flex flex-wrap justify-center gap-2">
                <Tooltip content="Share via Email">
                    <EmailShareButton
                        url={url}
                        subject={`Check out this read: ${readModel.title}`}
                        body={`I found this read interesting and thought you might like it too! Link: ${url}`}
                    >
                        <EmailIcon size={32} round />
                    </EmailShareButton>
                </Tooltip>

                <Tooltip content="Share on X">
                    <TwitterShareButton
                        url={url}
                        title={readModel.title}
                        hashtags={[readModel.category]}
                    >
                        <XIcon size={32} round />
                    </TwitterShareButton>
                </Tooltip>

                <Tooltip content="Share on LinkedIn">
                    <LinkedinShareButton
                        url={url}
                        title={readModel.title}
                        summary={readModel.summary}
                        source="Sanskar's Website"
                    >
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </Tooltip>

                <Tooltip content="Share on Reddit">
                    <RedditShareButton url={url} title={readModel.title}>
                        <RedditIcon size={32} round />
                    </RedditShareButton>
                </Tooltip>
            </div>
        </div>
    );
};

export default SocialShare;
