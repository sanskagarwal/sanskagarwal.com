import { getNotes } from "../_dataprovider/NoteDataProvider";
import { ContentList } from "../_components/ContentComponent";
import { ContentType } from "../_models/ContentType";

export const metadata = {
    title: "Notes",
    description: "AI-converted notes and reading highlights by Sanskar Agarwal.",
    alternates: { canonical: "/notes" },
};

export const dynamic = "force-dynamic";

const NoteList = async () => {
    const notes = await getNotes();

    return (
        <ContentList items={notes} contentType={ContentType.Note} showBanner />
    );
};

export default NoteList;
