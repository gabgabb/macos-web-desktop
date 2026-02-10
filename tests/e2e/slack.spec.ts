import { expect, test } from "@/tests/e2e/setup";
import { bootDesktop } from "../helpers/boot";
import { openSlack, selectConversation } from "../helpers/slack";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("slack opens with sidebar and messages", async ({ page }) => {
    await bootDesktop(page);
    await openSlack(page);

    await expect(page.getByText("Channels")).toBeVisible();
    await expect(page.getByText("Direct messages")).toBeVisible();

    await expect(page.getByTestId("slack-message-list")).toBeVisible();
});

test("selecting channel updates header", async ({ page }) => {
    await bootDesktop(page);
    await openSlack(page);

    await selectConversation(page, "random");

    await expect(page.getByTestId("channel-name")).toContainText("# random");
});

test("selecting DM updates header to user", async ({ page }) => {
    await bootDesktop(page);
    await openSlack(page);

    await selectConversation(page, "dm-unknown");

    await expect(page.getByText("Online")).toBeVisible();
    await expect(page.getByTestId("dm-avatar")).toBeVisible();
});

test("input placeholder adapts to conversation type", async ({ page }) => {
    await bootDesktop(page);
    await openSlack(page);

    await selectConversation(page, "general");

    await expect(page.getByTestId("slack-input")).toHaveAttribute(
        "placeholder",
        "Message #general",
    );

    await selectConversation(page, "dm-unknown");

    await expect(page.getByTestId("slack-input")).toHaveAttribute(
        "placeholder",
        "Message unknown",
    );
});

test("messages of active conversation are visible", async ({ page }) => {
    await bootDesktop(page);
    await openSlack(page);

    await expect(
        page.locator('[data-testid^="slack-message-"]').first(),
    ).toBeVisible();
});

test("opening conversation marks it as read", async ({ page }) => {
    await bootDesktop(page);
    await openSlack(page);

    const convo = page.getByTestId("slack-convo-incidents");

    const unread = convo.getByTestId("unread-pin");
    await expect(unread).toBeVisible();

    await convo.click();

    await expect(convo.getByTestId("unread-pin")).toHaveCount(0);
});

test("typing indicator appears and disappears", async ({ page }) => {
    await bootDesktop(page);
    await openSlack(page);

    await selectConversation(page, "dm-unknown");

    await page.evaluate(() => {
        (window as any).__desktopStore
            ?.getState()
            .startTyping("unknown", "unknown");
    });

    const messageList = page.getByTestId("slack-message-list");
    const typingRow = page.getByTestId("typing-row");

    await expect(typingRow).toBeVisible();

    await expect(messageList).toContainText("Unknown");

    const rows = messageList.locator("> *");
    const lastRow = rows.last();

    await expect(lastRow).toHaveAttribute("data-testid", "typing-row");

    await page.evaluate(() => {
        (window as any).__desktopStore?.getState().stopTyping();
    });

    await expect(typingRow).toHaveCount(0);
});
