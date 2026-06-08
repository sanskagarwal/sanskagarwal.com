import Link from "next/link";

import ReadingShell from "@/app/_components/ReadingShell";
import { Button } from "@/app/_components/ui/Button";

const NotFound = () => (
    <ReadingShell>
        <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Blog not found</h1>
            <p className="text-muted-foreground mb-6">
                The blog you are looking for does not exist.
            </p>
            <Link href="/blog">
                <Button>Back to blogs</Button>
            </Link>
        </div>
    </ReadingShell>
);

export default NotFound;
