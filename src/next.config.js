/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    turbopack: {
        resolveAlias: {
            canvas: "./empty-module.js",
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cook.sanskagarwal.com",
            },
        ],
    },
};

module.exports = nextConfig;
