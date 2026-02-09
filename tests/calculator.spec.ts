import { expect, test } from "@playwright/test";
import { bootDesktop } from "./helpers/boot";
import { openCalculator, press } from "./helpers/calculator";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("calculator shows initial value", async ({ page }) => {
    await bootDesktop(page);
    const display = await openCalculator(page);

    await expect(display).toHaveText("0");
});

test("calculator computes simple addition", async ({ page }) => {
    await bootDesktop(page);
    const display = await openCalculator(page);

    await press(page, "2");
    await press(page, "+");
    await press(page, "3");
    await press(page, "=");

    await expect(display).toHaveText("5");
});

test("calculator computes chained operation", async ({ page }) => {
    await bootDesktop(page);
    const display = await openCalculator(page);

    // 7 * 6 - 4 = 38
    await press(page, "7");
    await press(page, "*");
    await press(page, "6");
    await press(page, "-");
    await press(page, "4");
    await press(page, "=");

    await expect(display).toHaveText("38");
});

test("calculator reset clears value", async ({ page }) => {
    await bootDesktop(page);
    const display = await openCalculator(page);

    await press(page, "9");
    await press(page, "9");

    await expect(display).toHaveText("99");

    await page.getByTestId("calc-btn-clear").click();

    await expect(display).toHaveText("0");
});

test("calculator shows error on invalid expression", async ({ page }) => {
    await bootDesktop(page);
    const display = await openCalculator(page);

    await press(page, "+");
    await press(page, "=");

    await expect(display).toHaveText("Error");
});
