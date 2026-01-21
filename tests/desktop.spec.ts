import { bootDesktop } from "@/tests/helpers/boot";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("open and minimize notes window", async ({ page }) => {
    await bootDesktop(page);

    const dock = page.getByTestId("dock");
    await expect(dock).toBeVisible();

    const notes = page.getByTestId("dock-notes");
    await expect(notes).toBeVisible();

    // open
    await notes.click();
    const notesWindow = page.getByTestId("window-notes");
    await expect(notesWindow).toBeVisible();

    // minimize
    await notes.click();
    await expect(notesWindow).not.toBeVisible();

    // settings
    const settings = page.getByTestId("dock-settings");
    await expect(settings).toBeVisible();

    await settings.click();
    const settingsWindow = page.getByTestId("window-settings");
    await expect(settingsWindow).toBeVisible();

    await settings.click();
    await expect(settingsWindow).not.toBeVisible();

    // safari
    const safari = page.getByTestId("dock-safari");
    await expect(safari).toBeVisible();

    await safari.click();
    const safariWindow = page.getByTestId("window-safari");
    await expect(safariWindow).toBeVisible();

    await safari.click();
    await expect(safariWindow).not.toBeVisible();
});

test("dock shows active app indicator", async ({ page }) => {
    await bootDesktop(page);

    const notes = page.getByTestId("dock-notes");
    await expect(notes).toBeVisible();

    await notes.click();

    const activeIndicator = page.getByTestId("dock-notes-active");
    await expect(activeIndicator).toBeVisible();

    await notes.click();
    await expect(activeIndicator).not.toBeVisible();
});

test("drag notes window", async ({ page }) => {
    await bootDesktop(page);

    const notes = page.getByTestId("dock-notes");
    await expect(notes).toBeVisible();
    await notes.click();

    const window = page.getByTestId("window-notes");
    await expect(window).toBeVisible();

    const header = page.getByTestId("window-notes-header");
    await expect(header).toBeVisible();

    const boxBefore = await window.boundingBox();
    expect(boxBefore).not.toBeNull();

    const headerBox = await header.boundingBox();
    if (!headerBox || !boxBefore) throw new Error("No bounding box");

    const startX = headerBox.x + headerBox.width / 2;
    const startY = headerBox.y + headerBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 120, startY + 60, { steps: 12 });
    await page.mouse.up();

    const boxAfter = await window.boundingBox();
    expect(boxAfter).not.toBeNull();

    // tolérance CI
    expect(Math.abs(boxAfter!.x - boxBefore!.x)).toBeGreaterThan(10);
    expect(Math.abs(boxAfter!.y - boxBefore!.y)).toBeGreaterThan(10);
});
