import React from "react";

/** Centered reading column shared by article, loading, error, and not-found states. */
const ReadingShell: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-5 sm:py-8 md:px-8">
        <article className="rounded-lg border border-border bg-card text-card-foreground p-5 shadow-sm sm:p-6 md:p-10">
            {children}
        </article>
    </div>
);

export default ReadingShell;
