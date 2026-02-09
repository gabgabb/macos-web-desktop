import { expect, test } from "@playwright/test";
import { bootDesktop } from "./helpers/boot";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("notes content persists after closing and reopening app", async ({
    page,
}) => {
    await bootDesktop(page);

    const notesDock = page.getByTestId("dock-notes");
    await notesDock.click();

    const textarea = page.getByTestId("notes-textarea");
    await expect(textarea).toBeVisible();

    const text = "Hello Playwright 👋\nThis note should persist.";

    await textarea.fill(text);
    await expect(textarea).toHaveValue(text);

    await notesDock.click();

    await expect(page.locator('[data-testid="window-notes"]')).toHaveCount(0);

    await notesDock.click();

    const textareaAfter = page.getByTestId("notes-textarea");
    await expect(textareaAfter).toBeVisible();
    await expect(textareaAfter).toHaveValue(text);
});

test("notes content persists after reload", async ({ page }) => {
    await bootDesktop(page);

    await page.getByTestId("dock-notes").click();

    const textarea = page.getByTestId("notes-textarea");
    const text = "Persistent note after reload 🚀";

    await textarea.fill(text);

    await page.reload();

    await expect(page.getByTestId("notes-textarea")).toHaveValue(text);
});
