import { bootDesktop } from "@/tests/helpers/boot";
import { expect, test } from "@playwright/test";

test("open and minimize notes window", async ({ page }) => {
    await bootDesktop(page);

    await page.getByTestId("notes").click();
    await expect(page.getByTestId("window-notes")).toBeVisible();

    await page.getByTestId("notes").click();
    await expect(page.getByTestId("window-notes")).not.toBeVisible();

    await page.getByTestId("settings").click();
    await expect(page.getByTestId("window-settings")).toBeVisible();

    await page.getByTestId("settings").click();
    await expect(page.getByTestId("window-settings")).not.toBeVisible();

    await page.getByTestId("safari").click();
    await expect(page.getByTestId("window-safari")).toBeVisible();

    await page.getByTestId("safari").click();
    await expect(page.getByTestId("window-safari")).not.toBeVisible();
});

test("dock shows active app indicator", async ({ page }) => {
    await bootDesktop(page);

    await page.getByTestId("notes").click();
    await expect(page.getByTestId("isActive").nth(1)).toBeVisible();

    await page.getByTestId("notes").click();
    await expect(page.getByTestId("isActive").nth(1)).not.toBeVisible();
});
