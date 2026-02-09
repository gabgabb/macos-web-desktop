import { expect, Page } from "@playwright/test";

export async function openDoom(page: Page) {
    const dock = page.getByTestId("dock-doom");
    await expect(dock).toBeVisible();
    await dock.click();

    await expect(page.getByTestId("doom-launcher-title")).toBeVisible();
}
