import { Constants } from "./Constants";

export const getBlogs = async () => {
    return await fetch(`${Constants.URI}/api/blogs`).then((res) => res.json());    
}

export const getBlog = async (blogUrl: string) => {
    return await fetch(`${Constants.URI}/api/blogs/${blogUrl}`).then((res) => res.json());
}
