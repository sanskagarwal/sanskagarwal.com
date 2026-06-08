import { getBlogs } from "../_dataprovider/BlogDataProvider";
import { ContentList } from "../_components/ContentComponent";
import { ContentType } from "../_models/ContentType";

export const dynamic = "force-dynamic";

const BlogList = async () => {
    const blogs = await getBlogs();

    return <ContentList items={blogs} contentType={ContentType.Blog} />;
};

export default BlogList;
