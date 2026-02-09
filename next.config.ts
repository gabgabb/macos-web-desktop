import type { NextConfig } from "next";

const isDev = process.env.NEXT_ENV === "dev";
const isTest = process.env.NEXT_ENV === "test";

const nextConfig: NextConfig = {
    reactStrictMode: isDev,
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
    compiler: {
        removeConsole: isTest
            ? false
            : {
                  exclude: ["error"],
              },
    },
};

export default nextConfig;
