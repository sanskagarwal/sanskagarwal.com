"use client";

import dynamic from "next/dynamic";

const ResumeViewer = dynamic(() => import("../_components/ResumeViewer"), {
    ssr: false,
    loading: () => (
        <div className="mx-auto w-full max-w-4xl px-5 py-8 md:px-8">
            <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-card p-6 shadow-sm md:p-10">
                <div className="w-full max-w-md space-y-3">
                    <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-72 w-full animate-pulse rounded bg-muted" />
                </div>
            </div>
        </div>
    ),
});

const Resume: React.FC = () => {
    return <ResumeViewer />;
};

export default Resume;
