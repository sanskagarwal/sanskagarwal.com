import React from "react";

import { cn } from "../../_utils/cn";

/** Animated placeholder block used while content loads. */
const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div
        aria-hidden="true"
        className={cn("animate-pulse rounded bg-muted", className)}
        {...props}
    />
);

/** Grid of placeholder cards mirroring the blog/notes/recipes list layout. */
export const CardGridSkeleton: React.FC<{ count?: number }> = ({
    count = 6,
}) => (
    <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        role="status"
        aria-label="Loading"
    >
        {Array.from({ length: count }, (_, i) => (
            <div
                key={i}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm"
            >
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        ))}
        <span className="sr-only">Loading...</span>
    </div>
);
