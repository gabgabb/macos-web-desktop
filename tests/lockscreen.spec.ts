import { expect, test } from "@playwright/test";
import { bootDesktop } from "./helpers/boot";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("desktop is locked on first load", async ({ page }) => {
    await page.goto("/");

    const lock = page.getByTestId("lock-screen");
    await expect(lock).toBeVisible();
});

test("unlock removes lockscreen", async ({ page, browserName }) => {
    await bootDesktop(page, browserName);

    await expect(page.getByTestId("lock-screen")).not.toBeVisible();
    await expect(page.getByTestId("desktop")).toBeVisible();
});

test("lockscreen appears after clicking lock icon", async ({ page }) => {
    await bootDesktop(page);

    const lockIcon = page.getByTestId("lock-icon");
    await expect(lockIcon).toBeVisible();
    await lockIcon.click();

    const lock = page.getByTestId("lock-screen");
    await expect(lock).toBeVisible();
});
