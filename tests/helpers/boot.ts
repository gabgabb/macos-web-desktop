import { useDesktopStore } from "@/src/store/desktop-store";
import { Page, expect } from "@playwright/test";

export async function bootDesktop(page: Page, browserName = "webkit") {
    await page.goto("/");

    const lock = page.getByTestId("lock-screen");
    await expect(lock).toBeVisible();

    await lock.click();

    const input = page.getByTestId("lock-input");
    await expect(input).toBeVisible();

    await input.fill("aurora");

    if (browserName === "webkit") {
        await page.waitForTimeout(200);
        expect(useDesktopStore.getState().isLocked).toBe(false);
        await page.goto("/");
    }

    await expect(page.getByText("Unlocking...")).not.toBeVisible();
}
