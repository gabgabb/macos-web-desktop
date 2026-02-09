import { expect, Page } from "@playwright/test";

export async function openFinder(page: Page) {
    const icon = page.getByTestId("dock-finder");
    await icon.click();
    await expect(page.getByTestId("window-finder")).toBeVisible();
}

export async function navigateSidebar(page: Page, key: string) {
    const item = page.getByTestId(key);
    await item.click();
}

export async function doubleClickItem(page: Page, name: string) {
    const item = page.getByTestId(`finder-item-${name}`);
    await item.dblclick();
}
