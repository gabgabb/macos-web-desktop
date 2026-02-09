import { expect, test } from "@playwright/test";
import { bootDesktop } from "./helpers/boot";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("settings: theme, accent and wallpaper persist after reload", async ({
    page,
}) => {
    await bootDesktop(page);

    await page.getByTestId("dock-settings").click();
    const settingsWindow = page.getByTestId("window-settings");
    await expect(settingsWindow).toBeVisible();

    const html = page.locator("html");

    /* =====================
     * THEME
     * ===================== */
    await page.getByTestId("theme-dark").click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    /* =====================
     * ACCENT COLOR
     * ===================== */
    const accentBefore = await html.evaluate((el) =>
        el.style.getPropertyValue("--accent"),
    );

    await page.getByTestId("accent-orange").click();

    const accentAfter = await html.evaluate((el) =>
        el.style.getPropertyValue("--accent"),
    );

    expect(accentAfter).not.toBe(accentBefore);

    /* =====================
     * WALLPAPER (dynamic)
     * ===================== */
    const wallpaper = page.getByTestId("wallpaper");

    const srcBefore = await wallpaper.getAttribute("src");
    expect(srcBefore).not.toBeNull();

    const secondDynamic = page
        .getByTestId("wallpaper-section-dynamic-wallpapers")
        .locator('[data-testid^="wallpaper-"]')
        .nth(1);

    await secondDynamic.click();

    await expect(wallpaper).not.toHaveAttribute("src", srcBefore!);

    /* =====================
     * RELOAD & PERSISTENCE
     * ===================== */
    await page.reload();

    const srcAfter = await page.getByTestId("wallpaper").getAttribute("src");

    expect(srcAfter).toBeTruthy();
    expect(srcAfter).not.toBe(srcBefore);
    await expect(html).toHaveAttribute("data-theme", "dark");

    const accentAfterReload = await html.evaluate((el) =>
        el.style.getPropertyValue("--accent"),
    );

    expect(accentAfterReload).toBe(accentAfter);
});
