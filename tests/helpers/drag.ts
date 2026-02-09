import { AppId } from "@/src/core/apps/types";
import { expect } from "@playwright/test";
import type { Page } from "playwright-core";

type DragOptions = {
    dx?: number;
    dy?: number;
};

export async function dragAppWindow(
    page: Page,
    app: AppId,
    options: DragOptions = {},
) {
    const { dx = 150, dy = 80 } = options;

    const dockIcon = page.getByTestId(`dock-${app}`);
    const window = page.getByTestId(`window-${app}`);
    const header = page.getByTestId(`window-${app}-header`);

    if (!(await window.isVisible())) {
        await expect(dockIcon).toBeVisible();
        await dockIcon.click();
        await expect(window).toBeVisible();
    }

    await expect(header).toBeVisible();

    const boxBefore = await window.boundingBox();
    const headerBox = await header.boundingBox();

    if (!boxBefore || !headerBox) {
        throw new Error(`Cannot get bounding box for ${app}`);
    }

    const startX = headerBox.x + headerBox.width / 2;
    const startY = headerBox.y + headerBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + dx, startY + dy, { steps: 10 });
    await page.mouse.up();

    const boxAfter = await window.boundingBox();
    if (!boxAfter) {
        throw new Error(`Window ${app} disappeared after drag`);
    }

    const dxMoved = Math.abs(boxAfter.x - boxBefore.x);
    const dyMoved = Math.abs(boxAfter.y - boxBefore.y);

    expect(dxMoved + dyMoved).toBeGreaterThan(10);

    await dockIcon.click();
    await expect(window).not.toBeVisible();
}
