import { AppId } from "@/src/core/apps/types";
import { expect } from "@/tests/e2e/setup";
import { Locator } from "@playwright/test";
import type { Page } from "playwright-core";

export async function toggleApp(page: Page, app: AppId) {
    const dockIcon = page.getByTestId(`dock-${app}`);
    const window = page.getByTestId(`window-${app}`);

    await toggleApplicationWindow(page, dockIcon, app);
}

export async function toggleAppByDesktopIcon(page: Page, app: AppId) {
    const desktopIcon = page.getByTestId(`desktop-icon-${app}`);

    await toggleApplicationWindow(page, desktopIcon, app, true);
}

async function toggleApplicationWindow(
    page: Page,
    icon: Locator,
    app: AppId,
    isDesktopIcon = false,
) {
    const window = page.getByTestId(`window-${app}`);

    await expect(icon).toBeVisible();
    if (isDesktopIcon) {
        await icon.dblclick();
    } else {
        await icon.click();
    }
    await expect(window).toBeVisible();

    const activeIndicator = page.getByTestId(`dock-${app}-active`);
    await expect(activeIndicator).toBeVisible();

    if (isDesktopIcon) {
        const closeButton = page.getByTestId(`window-${app}-close-button`);
        await closeButton.click();
        await expect(window).not.toBeVisible();
    } else {
        await icon.click();
        await expect(window).not.toBeVisible();
    }
}
