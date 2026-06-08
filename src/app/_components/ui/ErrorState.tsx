"use client";

import React from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

import { Button } from "./Button";

type ErrorStateProps = {
    title?: string;
    description?: string;
    onRetry?: () => void;
};

/** Shared, friendly error panel with an optional retry action. */
export const ErrorState: React.FC<ErrorStateProps> = ({
    title = "Something went wrong",
    description = "We couldn't load this content. Please try again.",
    onRetry,
}) => (
    <div
        role="alert"
        className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-lg border border-border bg-card p-8 text-center shadow-sm"
    >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
            <FaTriangleExclamation className="h-5 w-5" />
        </span>
        <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {onRetry && <Button onClick={onRetry}>Try again</Button>}
    </div>
);
