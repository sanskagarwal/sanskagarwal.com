"use client";

import React from "react";
import { pdfjs, Document, Page } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

const Resume: React.FC = () => {
    return (
        <>
            <Document file="/me.pdf">
                <Page pageNumber={1} />
            </Document>
        </>
    );
};

export default Resume;
