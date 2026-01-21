import { expect, test } from "@playwright/test";
import { bootDesktop } from "./helpers/boot";

test("wallpaper persists after reload", async ({ page }) => {
    await bootDesktop(page);

    const bg = await page.getByTestId("wallpaper").getAttribute("style");

    await page.getByTestId("settings").click();
    await page.getByTestId("background-safarii.webp").click();

    await page.reload();

    const bgAfter = await page.getByTestId("wallpaper").getAttribute("style");

    expect(bgAfter).not.toBe(bg);
});
