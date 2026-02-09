import { expect, test } from "@/tests/setup";
import { bootDesktop } from "./helpers/boot";
import {
    openCalendar,
    openDay,
    selectMonth,
    selectYear,
} from "./helpers/calendar";

test("calendar opens and shows days", async ({ page }) => {
    await bootDesktop(page);
    await openCalendar(page);

    await expect(page.getByText("Mon", { exact: true })).toBeVisible();
    await expect(page.getByText("Sun")).toBeVisible();
});

test("navigate months using arrows", async ({ page }) => {
    await bootDesktop(page);
    await openCalendar(page);

    const monthLabel = page.getByTestId("month-select").first();

    const before = await monthLabel.textContent();

    await page.getByRole("button", { name: "Next month" }).click();

    const after = await monthLabel.textContent();

    expect(after).not.toBe(before);
});

test("select month and year via dropdown and open event", async ({ page }) => {
    await bootDesktop(page);
    await openCalendar(page);

    await selectYear(page, 2025);
    await selectMonth(page, 0);

    await openDay(page, "2025-01-15");

    const modal = page.getByTestId("calendar-event-modal");
    await expect(modal).toBeVisible();
    await expect(page.getByText("Meeting")).toBeVisible();
});

test("close calendar event modal by clicking overlay", async ({ page }) => {
    await bootDesktop(page);
    await openCalendar(page);

    await selectYear(page, 2025);
    await selectMonth(page, 0);

    await openDay(page, "2025-01-15");

    await expect(page.getByTestId("calendar-event-modal")).toBeVisible();

    await page.getByTestId("close-event-modal").click();

    await expect(page.getByTestId("calendar-event-modal")).toHaveCount(0);
});

test("clicking day without event does nothing", async ({ page }) => {
    await bootDesktop(page);
    await openCalendar(page);

    await selectYear(page, 2025);
    await selectMonth(page, 0);

    await page.getByTestId("calendar-day-2025-01-10").click();

    await expect(page.getByTestId("calendar-event-modal")).toHaveCount(0);
});
