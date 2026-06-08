import { getBlogs } from "../_dataprovider/BlogDataProvider";
import { ContentList, ContentType } from "../_components/ContentComponent";

export const dynamic = "force-dynamic";

const BlogList = async () => {
    const blogs = await getBlogs();

    return <ContentList items={blogs} contentType={ContentType.Blog} />;
};

export default BlogList;
