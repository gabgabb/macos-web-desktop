import { expect } from "@/tests/e2e/setup";
import { Page } from "@playwright/test";

export async function openSafari(page: Page) {
    const dock = page.getByTestId("dock-safari");
    await expect(dock).toBeVisible();
    await dock.click();

    const display = page.getByTestId("window-safari");
    await expect(display).toBeVisible();

    return display;
}
