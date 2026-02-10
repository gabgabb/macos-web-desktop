import { expect, test } from "@/tests/e2e/setup";
import { bootDesktop } from "../helpers/boot";
import { openDoom } from "../helpers/doom";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("doom launcher opens", async ({ page }) => {
    await bootDesktop(page);
    await openDoom(page);

    await expect(page.getByText("SELECT YOUR DOOM")).toBeVisible();
});

test("launch doom by clicking option", async ({ page }) => {
    await bootDesktop(page);
    await openDoom(page);

    await page.getByTestId("doom-option-doom-ori").click();

    const runtime = page.getByTestId("doom-runtime");
    await expect(runtime).toBeVisible();

    const iframe = page.getByTestId("doom-iframe");
    await expect(iframe).toHaveAttribute("src", /doom-ori\.wad/);
});

test("launch doom using keyboard navigation", async ({ page }) => {
    await bootDesktop(page);
    await openDoom(page);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    const iframe = page.getByTestId("doom-iframe");
    await expect(iframe).toHaveAttribute("src", /doom-ud\.wad/);
});

test("quit doom returns to launcher", async ({ page }) => {
    await bootDesktop(page);
    await openDoom(page);

    await page.getByTestId("doom-option-doom2").click();

    await expect(page.getByTestId("doom-runtime")).toBeVisible();

    await page.getByTestId("doom-quit").click();

    await expect(page.getByTestId("doom-launcher-title")).toBeVisible();
});

test("doom runtime iframe loads successfully", async ({ page }) => {
    await bootDesktop(page);

    await page.getByTestId("dock-doom").click();

    await page.getByTestId("doom-option-doom-ori").click();

    const iframe = page.getByTestId("doom-iframe");
    await expect(iframe).toBeVisible();

    await expect(iframe).toHaveAttribute("src", /doom-ori\.wad/);

    await page.waitForFunction(() => {
        const iframe = document.querySelector(
            '[data-testid="doom-iframe"]',
        ) as HTMLIFrameElement | null;

        if (!iframe) return false;

        if (!iframe.contentWindow) return false;

        return iframe.contentDocument?.readyState === "complete";
    });
});
