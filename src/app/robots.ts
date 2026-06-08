import type { MetadataRoute } from "next";

import { Constants } from "./_utils/Constants";

const robots = (): MetadataRoute.Robots => ({
    rules: {
        userAgent: "*",
        allow: "/",
    },
    sitemap: `${Constants.SITE_URI}/sitemap.xml`,
    host: Constants.SITE_URI,
});

export default robots;
