import { Page, expect } from "@playwright/test";

export async function bootDesktop(page: Page) {
    await page.goto("/");

    const lock = page.getByTestId("lock-screen");
    await expect(lock).toBeVisible();

    const input = page.getByTestId("lock-input");
    await expect(input).toBeEnabled();

    await input.fill("aurora");
    await input.press("Enter");

    await expect(page.getByTestId("dock")).toBeVisible();

    await expect(page.getByText("Unlocking...")).not.toBeVisible();
}
