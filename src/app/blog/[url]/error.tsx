"use client";

import ReadingShell from "@/app/_components/ReadingShell";
import { Button } from "@/app/_components/ui/Button";

const Error = ({ reset }: { error: Error; reset: () => void }) => (
    <ReadingShell>
        <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
                Failed to load this blog. Please try again.
            </p>
            <Button onClick={reset}>Retry</Button>
        </div>
    </ReadingShell>
);

export default Error;
