import Link from "next/link";

import ReadingShell from "@/app/_components/ReadingShell";
import { Button } from "@/app/_components/ui/Button";

const NotFound = () => (
    <ReadingShell>
        <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Note not found</h1>
            <p className="text-muted-foreground mb-6">
                The note you are looking for doesn&apos;t exist or may have been
                moved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/notes">
                    <Button>Browse all notes</Button>
                </Link>
                <Link href="/">
                    <Button variant="outline">Go home</Button>
                </Link>
            </div>
        </div>
    </ReadingShell>
);

export default NotFound;
