import { test as base } from "@playwright/test";

export const test = base.extend({});

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");

        // coverage
        // @ts-ignore
        window.__coverage__ = {};
    });
});

export { expect } from "@playwright/test";
