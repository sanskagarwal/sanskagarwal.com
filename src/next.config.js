/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
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
