import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getNote } from "@/app/_dataprovider/NoteDataProvider";
import ReadComponent from "@/app/_components/ReadComponent";

export const revalidate = 3600;

type Params = {
    url: string;
};

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { url } = await params;
    const note = await getNote(url);

    if (!note) {
        return { title: "Not Found" };
    }

    return {
        title: note.title,
        description: note.summary,
        alternates: { canonical: `/notes/${url}` },
        openGraph: {
            type: "article",
            title: note.title,
            description: note.summary,
            url: `/notes/${url}`,
            publishedTime: new Date(note.published_at).toISOString(),
        },
        twitter: {
            card: "summary_large_image",
            title: note.title,
            description: note.summary,
        },
    };
}

const NotePage = async ({ params }: { params: Promise<Params> }) => {
    const { url } = await params;
    const note = await getNote(url);

    if (!note) {
        notFound();
    }

    return (
        <ReadComponent
            readModel={note}
            backHref="/notes"
            backLabel="All notes"
            canonicalPath={`/notes/${url}`}
        />
    );
};

export default NotePage;
