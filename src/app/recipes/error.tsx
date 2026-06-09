"use client";

import { ErrorState } from "@/app/_components/ui/ErrorState";

const RecipesError = ({ reset }: { error: Error; reset: () => void }) => (
    <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8">
        <ErrorState
            description="We couldn't load the recipes. Please try again."
            onRetry={reset}
        />
    </div>
);

export default RecipesError;
