"use client";

import { ErrorState } from "@/app/_components/ui/ErrorState";

const HomeError = ({ reset }: { error: Error; reset: () => void }) => (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 md:px-8 lg:px-12">
        <ErrorState
            description="We couldn't load the homepage. Please try again."
            onRetry={reset}
        />
    </div>
);

export default HomeError;
