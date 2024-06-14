import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        remotePatterns: [
            {
                hostname: "mellow-caribou-389.convex.cloud",
            },
        ],
    },
};

export default nextConfig;
