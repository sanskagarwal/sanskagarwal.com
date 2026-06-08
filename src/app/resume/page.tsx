"use client";

import dynamic from "next/dynamic";
import { List } from "react-content-loader";

const ResumeViewer = dynamic(() => import("../_components/ResumeViewer"), {
    ssr: false,
    loading: () => (
        <div className="p-4">
            <div className="w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8 flex flex-col items-center gap-4">
                <div className="w-full max-w-md mb-4">
                    <List />
                </div>
            </div>
        </div>
    ),
});

const Resume: React.FC = () => {
    return <ResumeViewer />;
};

export default Resume;
