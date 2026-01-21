import { expect, test } from "@playwright/test";
import { bootDesktop } from "./helpers/boot";

test("desktop is locked on first load", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("lock-screen")).toBeVisible();
});

test("unlock removes lockscreen", async ({ page }) => {
    await bootDesktop(page);
    await expect(page.getByTestId("lock-screen")).not.toBeVisible();
    await expect(page.getByTestId("desktop")).toBeVisible();
});

test("lockscreen after clicking on lock icon", async ({ page }) => {
    await bootDesktop(page);

    await page.getByTestId("lock-icon").click();

    await expect(page.getByTestId("lock-screen")).toBeVisible();
});
