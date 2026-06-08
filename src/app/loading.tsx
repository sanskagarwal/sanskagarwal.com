import { CardGridSkeleton } from "@/app/_components/ui/Skeleton";

const HomeLoading = () => (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8 lg:px-12">
        <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:justify-between">
            <div className="w-full space-y-4 text-center md:text-left">
                <div
                    className="mx-auto h-4 w-32 animate-pulse rounded bg-muted md:mx-0"
                    aria-hidden
                />
                <div
                    className="mx-auto h-12 w-3/4 animate-pulse rounded bg-muted md:mx-0"
                    aria-hidden
                />
                <div
                    className="mx-auto h-4 w-full animate-pulse rounded bg-muted md:mx-0"
                    aria-hidden
                />
                <div
                    className="mx-auto h-4 w-5/6 animate-pulse rounded bg-muted md:mx-0"
                    aria-hidden
                />
            </div>
            <div
                className="h-44 w-44 shrink-0 animate-pulse rounded-full bg-muted"
                aria-hidden
            />
        </div>
        <div className="mt-16">
            <div
                className="mb-6 h-8 w-40 animate-pulse rounded bg-muted"
                aria-hidden
            />
            <CardGridSkeleton count={3} />
        </div>
    </div>
);

export default HomeLoading;
