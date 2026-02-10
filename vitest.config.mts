import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        include: ["tests/unit/**/*.spec.ts*"],
        environmentOptions: {
            jsdom: {
                resources: "usable",
            },
        },
        pool: "forks",
        setupFiles: "./tests/unit/setup.ts",
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            reportsDirectory: "coverage",
            exclude: [
                "**/*.d.ts",
                "**/*.config.*",
                "**/node_modules/**",
                "**/components/**",
                "**/app/**",
                "**/public/**",
                "**/core/apps/**",
                "**/core/ui/**",
                "**/tests/helpers/**",
                "**/tests/*.spec.ts",
            ],
        },
    },
});
