import { Page, expect } from "@playwright/test";

export async function bootDesktop(page: Page) {
    await page.goto("/");

    const lock = page.getByTestId("lock-screen");
    await expect(lock).toBeVisible();

    await lock.click();

    const input = page.getByTestId("lock-input");
    await expect(input).toBeVisible();

    await input.fill("aurora");

    await expect(page.getByText("Unlocking...")).not.toBeVisible();
}
