import { CardGridSkeleton } from "@/app/_components/ui/Skeleton";

const ListLoading = () => (
    <div className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8">
        <div className="mb-6 space-y-2">
            <div className="h-9 w-40 animate-pulse rounded bg-muted" aria-hidden />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" aria-hidden />
        </div>
        <CardGridSkeleton count={6} />
    </div>
);

export default ListLoading;
