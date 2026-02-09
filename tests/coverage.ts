import type { Page } from "@playwright/test";

export async function collectCoverage(page: Page) {
    const coverage = await page.evaluate(() => {
        // @ts-ignore
        return window.__coverage__;
    });

    if (!coverage) return;

    await fetch("/api/__coverage__", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(coverage),
    });
}
