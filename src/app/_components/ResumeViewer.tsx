"use client";

import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useMediaQuery } from "react-responsive";
import { FaDownload } from "react-icons/fa6";

import { Constants } from "../_utils/Constants";
import { Button } from "./ui/Button";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const ResumeViewer: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const isXs = useMediaQuery({ maxWidth: 550 });
    const isSm = useMediaQuery({ maxWidth: 767 });
    const isMd = useMediaQuery({ maxWidth: 1024 });
    const isLg = useMediaQuery({ maxWidth: 1280 });

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

                {isLoading && (
                    <div className="w-full max-w-md space-y-3">
                        <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
                        <div className="h-72 w-full animate-pulse rounded bg-muted" />
                    </div>
                )}

                <Document loading="" file={encodeURI(Constants.Resume_URI)}>
                    <Page
                        scale={
                            isXs ? 0.6 : isSm ? 0.9 : isMd ? 1 : isLg ? 1.25 : 1.5
                        }
                        pageNumber={1}
                        onLoadSuccess={() => setIsLoading(false)}
                    />
                </Document>
            </div>
        </div>
    );
};

export default ResumeViewer;
