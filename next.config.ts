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
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                pathname: "/9.x/**",
            },
        ], //https://api.dicebear.com/9.x/shapes/svg?seed=Sarah
    },
};

export default nextConfig;
