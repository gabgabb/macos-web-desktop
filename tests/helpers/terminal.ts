import { expect } from "@/tests/e2e/setup";
import { Page } from "@playwright/test";

export async function openTerminal(page: Page) {
    const dock = page.getByTestId("dock-terminal");
    await expect(dock).toBeVisible();
    await dock.click();

    const input = page.getByTestId("terminal-input");
    await expect(input).toBeVisible();
    await input.focus();

    return input;
}

export async function runCmd(page: Page, cmd: string) {
    const input = page.getByTestId("terminal-input");
    await input.fill(cmd);
    await input.press("Enter");
}
