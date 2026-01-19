import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: process.env.NEXT_ENV === "dev",
    env: {
        NEXT_ENV: process.env.NEXT_ENV,
        NEXT_PUBLIC_LOCK_PASSWORD: process.env.NEXT_PUBLIC_LOCK_PASSWORD,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    compress: true,
    bundlePagesRouterDependencies: true,
};

export default nextConfig;
