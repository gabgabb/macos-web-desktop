import { bootDesktop } from "@/tests/helpers/boot";
import { dragAppWindow } from "@/tests/helpers/drag";
import { toggleApp, toggleAppByDesktopIcon } from "@/tests/helpers/toggleApp";
import { expect, test } from "@/tests/setup";

test("open and minimize notes window via dock", async ({ page }) => {
    await bootDesktop(page);

    await toggleApp(page, "notes");
    await toggleApp(page, "settings");
    await toggleApp(page, "safari");
    await toggleApp(page, "terminal");
    await toggleApp(page, "slack");
    await toggleApp(page, "calculator");
    await toggleApp(page, "calendar");
    await toggleApp(page, "doom");
    await toggleApp(page, "finder");
});

test("open and minimize notes window via desktop", async ({ page }) => {
    await bootDesktop(page);

    await toggleAppByDesktopIcon(page, "notes");
    await toggleAppByDesktopIcon(page, "settings");
    await toggleAppByDesktopIcon(page, "safari");
    await toggleAppByDesktopIcon(page, "terminal");
    await toggleAppByDesktopIcon(page, "slack");
    await toggleAppByDesktopIcon(page, "calculator");
    await toggleAppByDesktopIcon(page, "calendar");
    await toggleAppByDesktopIcon(page, "doom");
    await toggleAppByDesktopIcon(page, "finder");
});

test("drag notes window", async ({ page }) => {
    await bootDesktop(page);
    await dragAppWindow(page, "notes");
    await dragAppWindow(page, "settings");
    await dragAppWindow(page, "safari");
    await dragAppWindow(page, "terminal");
    await dragAppWindow(page, "slack");
    await dragAppWindow(page, "calculator");
    await dragAppWindow(page, "calendar");
    await dragAppWindow(page, "doom");
    await dragAppWindow(page, "finder");
});

test("open and close system panels", async ({ page }) => {
    await bootDesktop(page);

    await page.getByTestId("wifi-icon").click();
    await expect(page.getByText("Network")).toBeVisible();

    await page.getByTestId("wifi-overlay").click();
    await expect(page.getByText("Network")).not.toBeVisible();

    const audioIcon = page.getByTestId("audio-icon");
    await audioIcon.click();

    const audioPanel = page.getByText("Sound");
    await expect(audioPanel).toBeVisible();

    await page.getByTestId("audio-overlay").click();
    await expect(audioPanel).not.toBeVisible();

    const appearanceIcon = page.getByTestId("appearance-icon");
    await appearanceIcon.click();

    const themeLabel = page.getByText("Theme");
    await expect(themeLabel).toBeVisible();

    await page.getByTestId("appearance-overlay").click();
    await expect(themeLabel).not.toBeVisible();
});

test("change master volume", async ({ page }) => {
    await bootDesktop(page);

    const audioIcon = page.getByTestId("audio-icon");
    await audioIcon.click();
    await expect(page.getByText("Sound")).toBeVisible();

    const slider = page.locator('input[type="range"]#masterVolume');
    await expect(slider).toBeVisible();

    const valueBefore = await slider.inputValue();

    await slider.fill("0.25");

    const valueAfter = await slider.inputValue();
    expect(valueAfter).not.toBe(valueBefore);
});

test("change theme and accent color", async ({ page }) => {
    await bootDesktop(page);

    await page.getByTestId("appearance-icon").click();

    const html = page.locator("html");

    await page.getByTestId("theme-light").click();
    await expect(html).toHaveAttribute("data-theme", "light");

    await page.getByTestId("theme-dark").click();
    await expect(html).toHaveAttribute("data-theme", "dark");

    const accentBefore = await html.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--accent"),
    );

    await page.getByTestId("accent-teal").click();

    const accentAfter = await html.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--accent"),
    );

    expect(accentAfter).not.toBe(accentBefore);
});
