"use client";

import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { FaDownload } from "react-icons/fa6";

import { Constants } from "../_utils/Constants";
import { Button } from "./ui/Button";

// react-pdf needs a pdf.js worker; bundle it from the installed pdfjs-dist
// (self-hosted via the bundler, no CDN, avoids version mismatch).
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const ResumeViewer: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
    const [numPages, setNumPages] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [width, setWidth] = React.useState<number>();

    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => setWidth(el.clientWidth);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

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
                    ref={containerRef}
                    className="w-full"
                    role="region"
                    aria-label="Resume document preview"
                >
                    {isLoading && !hasError && (
                        <div className="mx-auto w-full max-w-md space-y-3">
                            <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
                            <div className="h-72 w-full animate-pulse rounded bg-muted" />
                            <span className="sr-only" role="status">
                                Loading resume…
                            </span>
                        </div>
                    )}

                    {hasError && (
                        <div className="mx-auto max-w-md rounded-md border border-border bg-muted/40 p-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                The resume preview could not be loaded.
                            </p>
                            <a
                                href={Constants.Resume_URI}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex"
                            >
                                <Button variant="secondary" size="sm">
                                    Download PDF
                                    <FaDownload />
                                </Button>
                            </a>
                        </div>
                    )}

                    {width && !hasError && (
                        <Document
                            loading=""
                            file={encodeURI(Constants.Resume_URI)}
                            className="flex flex-col items-center gap-4"
                            onLoadSuccess={({ numPages: n }) => {
                                setNumPages(n);
                                setIsLoading(false);
                            }}
                            onLoadError={() => {
                                setHasError(true);
                                setIsLoading(false);
                            }}
                        >
                            {Array.from({ length: numPages }, (_, i) => (
                                <Page
                                    key={i + 1}
                                    width={width}
                                    pageNumber={i + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="overflow-hidden rounded-md border border-border shadow-md"
                                />
                            ))}
                        </Document>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeViewer;
