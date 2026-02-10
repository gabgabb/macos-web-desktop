import { expect } from "@/tests/e2e/setup";
import { Page } from "@playwright/test";

export async function openCalculator(page: Page) {
    const dock = page.getByTestId("dock-calculator");
    await expect(dock).toBeVisible();
    await dock.click();

    const display = page.getByTestId("calculator-display");
    await expect(display).toBeVisible();

    return display;
}

export async function press(page: Page, key: string) {
    await page.getByTestId(`calc-btn-${key}`).click();
}
