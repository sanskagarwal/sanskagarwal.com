"use client";

import React from "react";
import { FaDownload } from "react-icons/fa6";

import { Constants } from "../_utils/Constants";
import { Button } from "./ui/Button";

const ResumeViewer: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    return (
        <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-8">
            <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-6 shadow-sm md:p-10">
                <div className="flex w-full items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Resume</h1>
                    <a
                        href={Constants.Resume_URI}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Button variant="secondary" size="sm">
                            Download
                            <FaDownload />
                        </Button>
                    </a>
                </div>

                <div
                    className="relative w-full"
                    role="region"
                    aria-label="Resume document preview"
                >
                    {isLoading && (
                        <div className="absolute inset-0 mx-auto w-full max-w-md space-y-3">
                            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
                            <div className="h-72 w-full animate-pulse rounded bg-muted" />
                            <span className="sr-only" role="status">
                                Loading resume...
                            </span>
                        </div>
                    )}

                    <iframe
                        src={`${encodeURI(Constants.Resume_URI)}#pagemode=none`}
                        title="Resume document"
                        className="h-[85vh] w-full rounded-md border border-border shadow-md"
                        onLoad={() => setIsLoading(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResumeViewer;
