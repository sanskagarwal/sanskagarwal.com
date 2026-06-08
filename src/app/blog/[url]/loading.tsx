import ReadingShell from "@/app/_components/ReadingShell";

const Bar = ({ className = "" }: { className?: string }) => (
    <div
        aria-hidden="true"
        className={`h-4 rounded bg-muted animate-pulse ${className}`}
    />
);

const Loading = () => (
    <ReadingShell>
        <div className="space-y-3" role="status" aria-label="Loading article">
            <Bar className="h-8 w-3/4" />
            <Bar className="w-1/3" />
            <div className="h-px bg-border my-6" />
            <Bar className="w-full" />
            <Bar className="w-full" />
            <Bar className="w-5/6" />
            <Bar className="w-full" />
            <Bar className="w-2/3" />
            <span className="sr-only">Loading…</span>
        </div>
    </ReadingShell>
);

export default Loading;
