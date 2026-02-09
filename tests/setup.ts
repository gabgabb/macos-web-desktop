import { test as base, expect, Page } from "@playwright/test";

async function collectCoverage(page: Page) {
    try {
        const coverage = await page.evaluate(() => {
            // @ts-ignore
            return window.__coverage__;
        });

        if (!coverage || Object.keys(coverage).length === 0) return;

        await fetch("/api/__coverage__", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(coverage),
        });
    } catch {}
}

export const test = base.extend({});

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");

        // init coverage
        // @ts-ignore
        window.__coverage__ = {};
    });
});

test.afterEach(async ({ page }) => {
    await collectCoverage(page);
});

export { expect };
