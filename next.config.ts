import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: process.env.NEXT_ENV === "dev",
    env: {
        NEXT_ENV: process.env.NEXT_ENV,
        LOCK_PASSWORD: process.env.LOCK_PASSWORD,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    compress: true,
    bundlePagesRouterDependencies: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                pathname: "/9.x/**",
            },
        ],
    },
};

export default nextConfig;
