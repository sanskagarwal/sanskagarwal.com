"use client";

import { ErrorState } from "@/app/_components/ui/ErrorState";

const NotesListError = ({ reset }: { error: Error; reset: () => void }) => (
    <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
        <ErrorState
            description="We couldn't load the notes. Please try again."
            onRetry={reset}
        />
    </div>
);

export default NotesListError;
