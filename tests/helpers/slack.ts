import { expect } from "@/tests/setup";
import { Page } from "@playwright/test";

export async function openSlack(page: Page) {
    const dock = page.getByTestId("dock-slack");
    await expect(dock).toBeVisible();
    await dock.click();

    await expect(page.getByTestId("slack-app")).toBeVisible();
}

export async function selectConversation(page: Page, id: string) {
    const convo = page.getByTestId(`slack-convo-${id}`);
    await expect(convo).toBeVisible();
    await convo.click();
}
