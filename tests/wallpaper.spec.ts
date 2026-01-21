import { expect, test } from "@playwright/test";
import { bootDesktop } from "./helpers/boot";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("wallpaper persists after reload", async ({ page, browserName }) => {
    await bootDesktop(page, browserName);

    const wallpaper = page.getByTestId("wallpaper");
    await expect(wallpaper).toBeVisible();

    const bgBefore = await wallpaper.evaluate(
        (el) => window.getComputedStyle(el).backgroundImage,
    );

    const settingsDock = page.getByTestId("dock-settings");
    await expect(settingsDock).toBeVisible();
    await settingsDock.click();

    const settingsWindow = page.getByTestId("window-settings");
    await expect(settingsWindow).toBeVisible();

    const safariBg = page.getByTestId("background-safarii.webp");
    await expect(safariBg).toBeVisible();
    await safariBg.click();

    await expect(wallpaper).not.toHaveCSS("background-image", bgBefore);

    await page.reload();

    const bgAfter = await page.getByTestId("wallpaper").getAttribute("style");

    expect(bgAfter).not.toBe(bgBefore);
});
