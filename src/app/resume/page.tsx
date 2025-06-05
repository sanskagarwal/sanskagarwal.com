"use client";

import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useMediaQuery } from "react-responsive";
import { List } from "react-content-loader";
import { Icon } from "semantic-ui-react";

import { Constants } from "../_utils/Constants";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

const Resume: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const isXs = useMediaQuery({ maxWidth: 550 });
    const isSm = useMediaQuery({ maxWidth: 767 });
    const isMd = useMediaQuery({ maxWidth: 1024 });
    const isLg = useMediaQuery({ maxWidth: 1280 });

    return (
        <div className="p-4">
            <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8 flex flex-col items-center gap-4">
                {isLoading && (
                    <div className="w-full max-w-md mb-4">
                        <List />
                    </div>
                )}
                {!isLoading && (
                    <a
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                        href={Constants.Resume_URI}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <span>Download Resume</span>
                        <Icon name="download" />
                    </a>
                )}
                <Document loading="" file={encodeURI(Constants.Resume_URI)}>
                    <Page
                        scale={
                            isXs
                                ? 0.6
                                : isSm
                                ? 0.9
                                : isMd
                                ? 1
                                : isLg
                                ? 1.25
                                : 1.5
                        }
                        pageNumber={1}
                        onLoadSuccess={() => setIsLoading(false)}
                    />
                </Document>
            </div>
        </div>
    );
};

export default Resume;
