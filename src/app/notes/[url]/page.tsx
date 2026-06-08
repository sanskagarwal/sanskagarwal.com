import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getNote } from "@/app/_dataprovider/NoteDataProvider";
import ReadComponent from "@/app/_components/ReadComponent";

export const dynamic = "force-dynamic";

type Params = {
    url: string;
};

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const note = await getNote(params.url);

    if (!note) {
        return { title: "Not Found" };
    }

    return {
        title: note.title,
        description: note.summary,
    };
}

const NotePage = async ({ params }: { params: Params }) => {
    const note = await getNote(params.url);

    if (!note) {
        notFound();
    }

    return <ReadComponent readModel={note} />;
};

export default NotePage;
