"use client";

import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Constants } from "../_utils/Constants";
import { List } from "react-content-loader";
import { Icon } from "semantic-ui-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

const Resume: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);

    return (
        <div className="grid grid-cols-6">
            <div
                className="py-4 bg-white md:col-start-2 md:col-span-4 col-span-6 px-5 md:px-10 lg:px-20 border-l border-r border-dashed shadow-indigo-500/50
                    shadow-md md:shadow-lg"
            >
                <div className="flex flex-col items-center">
                    <a
                        className="button download icon right labeled ui !mb-4"
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
                        scale={1.5}
                        pageNumber={1}
                        onLoadSuccess={() => setIsLoading(false)}
                    />
                </Document>
            </div>
        </div>
    );
};

export default Resume;
