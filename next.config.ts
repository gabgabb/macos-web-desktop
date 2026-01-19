import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: process.env.NEXT_ENV === "dev",
    env: {
        NEXT_ENV: process.env.NEXT_ENV,
    },
     typescript: {
        ignoreBuildErrors: false,
    },
    compress: true,
    bundlePagesRouterDependencies: true,
};

export default nextConfig;
