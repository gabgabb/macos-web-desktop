import { expect, test } from "@/tests/setup";
import { bootDesktop } from "./helpers/boot";
import { openTerminal, runCmd } from "./helpers/terminal";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("terminal shows welcome message", async ({ page }) => {
    await bootDesktop(page);
    await openTerminal(page);

    await expect(page.getByText("Type `help` to see commands.")).toBeVisible();
});

test("terminal basic commands work", async ({ page }) => {
    await bootDesktop(page);
    await openTerminal(page);

    await runCmd(page, "help");
    await expect(page.getByText("Available commands:")).toBeVisible();

    await runCmd(page, "echo hello world");
    await expect(page.getByText("hello world").nth(1)).toBeVisible();

    await runCmd(page, "clear");
    await expect(page.getByText("Type `help` to see commands.")).toBeVisible();
});

test("terminal filesystem commands", async ({ page }) => {
    await bootDesktop(page);
    await openTerminal(page);

    await runCmd(page, "pwd");
    await expect(page.getByText("/home/user")).toBeVisible();

    await runCmd(page, "ls");
    await expect(
        page.locator("text=/Documents|Downloads|Desktop/"),
    ).toBeVisible();

    await runCmd(page, "cd Documents");
    await runCmd(page, "pwd");
    await expect(page.getByText("/home/user/Documents")).toBeVisible();
});

test("terminal open command opens app", async ({ page }) => {
    await bootDesktop(page);
    await openTerminal(page);

    await runCmd(page, "open notes");

    await expect(page.getByTestId("window-notes")).toBeVisible();

    await expect(page.getByText("Opening notes...")).toBeVisible();
});

test("terminal lock command locks session", async ({ page }) => {
    await bootDesktop(page);
    await openTerminal(page);

    await runCmd(page, "lock");

    await expect(page.getByTestId("lock-screen")).toBeVisible();
});

test("terminal history persists after closing and reopening", async ({
    page,
}) => {
    await bootDesktop(page);
    await openTerminal(page);

    await runCmd(page, "echo persistent");

    await page.getByTestId("dock-terminal").click();

    await page.waitForTimeout(200);
    await openTerminal(page);

    await expect(page.getByText("persistent").nth(1)).toBeVisible();
});
