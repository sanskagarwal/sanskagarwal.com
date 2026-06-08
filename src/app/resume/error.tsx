"use client";

import { ErrorState } from "@/app/_components/ui/ErrorState";

const ResumeError = ({ reset }: { error: Error; reset: () => void }) => (
    <div className="mx-auto w-full max-w-4xl px-5 py-16 md:px-8">
        <ErrorState
            description="We couldn't load the resume. Please try again."
            onRetry={reset}
        />
    </div>
);

export default ResumeError;
