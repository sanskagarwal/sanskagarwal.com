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
        <div className="grid grid-cols-6">
            <div
                className="py-4 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dotted
                    shadow-2xl md:shadow-lg"
            >
                <div className="flex flex-col items-center">
                    <a
                        className="button download icon right labeled ui blue !mb-4"
                        href={Constants.Resume_URI}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Resume
                        <Icon name="download" />
                    </a>
                </div>
                {isLoading && <List />}
                <Document
                    className="flex flex-col items-center"
                    loading={<List />}
                    file={encodeURI(Constants.Resume_URI)}
                >
                    <Page
                        scale={isXs ? 0.6 : isSm ? 0.9 : isMd ? 1 : isLg ? 1.25 : 1.5}
                        pageNumber={1}
                        onLoadSuccess={() => setIsLoading(false)}
                    />
                </Document>
            </div>
        </div>
    );
};

export default Resume;
