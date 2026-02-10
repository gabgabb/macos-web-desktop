import { expect, test } from "@/tests/e2e/setup";
import { bootDesktop } from "../helpers/boot";
import {
    doubleClickItem,
    navigateSidebar,
    openFinder,
} from "../helpers/finder";

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        document.documentElement.setAttribute("data-e2e", "true");
    });
});

test("open finder and show default directory", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await expect(page.getByTestId("finder-path")).toHaveText("user");
});

test("navigate to Documents via sidebar", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await navigateSidebar(page, "documents");
    await expect(page.getByTestId("finder-path")).toHaveText("Documents");

    await expect(
        page.getByTestId("finder-item-CV_Gabriel_EN.pdf"),
    ).toBeVisible();
});

test("back and forward navigation works", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await navigateSidebar(page, "documents");
    await navigateSidebar(page, "downloads");

    await page.getByLabel("Go back").click();
    await expect(page.getByTestId("finder-path")).toHaveText("Documents");

    await page.getByLabel("Go forward").click();
    await expect(page.getByTestId("finder-path")).toHaveText("Downloads");
});

test("switch between grid and list view", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await page.getByTestId("finder-view-list").click();
    await expect(page.getByTestId("finder-list")).toBeVisible();

    await page.getByTestId("finder-view-grid").click();
    await expect(page.getByTestId("finder-grid")).toBeVisible();
});

test("search files", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await page.getByTestId("finder-search").click();
    await page.getByTestId("finder-search-input").fill("invoice");

    await expect(page.getByTestId("finder-item-invoice-jan.pdf")).toBeVisible();

    await expect(page.getByTestId("finder-item-invoice-feb.pdf")).toBeVisible();
});

test("double click folder opens it", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await navigateSidebar(page, "documents");
    await doubleClickItem(page, "Projects");

    await expect(page.getByTestId("finder-path")).toHaveText("Projects");
});

test("double click file opens preview", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await navigateSidebar(page, "documents");
    await doubleClickItem(page, "CV_Gabriel_EN.pdf");

    await expect(page.getByTestId("pdf-preview")).toBeVisible();
});

test("open text preview file", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await doubleClickItem(page, "Documents");
    await doubleClickItem(page, "cover-letter.txt");

    await expect(page.getByTestId("text-preview")).toBeVisible();
});

test("open html preview file", async ({ page }) => {
    await bootDesktop(page);
    await openFinder(page);

    await doubleClickItem(page, "Documents");
    await doubleClickItem(page, "Projects");
    await doubleClickItem(page, "Web");
    await doubleClickItem(page, "index.html");

    await expect(page.getByTestId("html-preview")).toBeVisible();
});
