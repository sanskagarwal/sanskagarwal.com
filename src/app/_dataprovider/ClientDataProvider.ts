import { Constants } from "../_utils/Constants";

export const fetcher = (url: string) => fetch(Constants.URI + url).then(res => res.json());
