import React from "react";

/** Centered reading column shared by article, loading, error, and not-found states. */
const ReadingShell: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <div className="mx-auto w-full max-w-3xl px-5 py-8 md:px-8">
        <article className="rounded-lg border border-border bg-card text-card-foreground p-6 shadow-sm md:p-10">
            {children}
        </article>
    </div>
);

export default ReadingShell;
