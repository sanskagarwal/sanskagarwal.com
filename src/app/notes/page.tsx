import { getNotes } from "../_dataprovider/NoteDataProvider";
import { ContentList, ContentType } from "../_components/ContentComponent";

export const dynamic = "force-dynamic";

const NoteList = async () => {
    const notes = await getNotes();

    return (
        <ContentList items={notes} contentType={ContentType.Note} showBanner />
    );
};

export default NoteList;
