import { Page, expect } from "@playwright/test";

export async function bootDesktop(page: Page) {
    await page.goto("/");
    await expect(page.getByTestId("lock-screen")).toBeVisible();
    await page.click('[data-testid="lock-screen"]');
    await page.click('input[type="password"]');
    await page.keyboard.type("aurora");
    await page.waitForTimeout(400);
}
