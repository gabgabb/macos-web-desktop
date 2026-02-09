import { expect } from "@/tests/setup";
import { Page } from "@playwright/test";

export async function openCalendar(page: Page) {
    const dock = page.getByTestId("dock-calendar");
    await expect(dock).toBeVisible();
    await dock.click();

    await expect(page.getByTestId("calendar-app")).toBeVisible();
}

export async function selectMonth(page: Page, monthIndex: number) {
    const monthSelect = page.getByTestId("month-select").first();
    await expect(monthSelect).toBeVisible();

    await monthSelect.click();

    const option = page.getByTestId(`select-option-${monthIndex}`);
    await expect(option).toBeVisible();
    await option.click();
}

export async function selectYear(page: Page, year: number) {
    const yearSelect = page.getByTestId("month-select").nth(1);
    await expect(yearSelect).toBeVisible();

    await yearSelect.click();

    const option = page.getByTestId(`select-option-${year}`);
    await expect(option).toBeVisible();
    await option.click();
}

export async function openDay(page: Page, date: string) {
    const day = page.getByTestId(`calendar-day-${date}`);
    await expect(day).toBeVisible();
    await day.click();
}
