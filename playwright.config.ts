import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

export default defineConfig({
    testDir: "./tests/e2e",

    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 1 : undefined,

    timeout: 30_000,
    expect: {
        timeout: 5_000,
    },

    reporter: [
        ["list"],
        [
            "playwright-ctrf-json-reporter",
            {
                outputFile: "ctrf/ctrf-report.json",
            },
        ],
    ],

    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",

        trace: isCI ? "on-first-retry" : "retain-on-failure",
        screenshot: "only-on-failure",
        video: "retain-on-failure",

        actionTimeout: 10_000,
        navigationTimeout: 15_000,
    },

    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
    ],
});
