import { expect, test } from "@/tests/e2e/setup";
import { bootDesktop } from "../helpers/boot";
import { openSafari } from "../helpers/safari";

test("safari opens and shows home", async ({ page }) => {
    await bootDesktop(page);
    await openSafari(page);

    await expect(page.getByPlaceholder("Search with Google")).toBeVisible();

    await expect(page.getByText("Favorites")).toBeVisible();
});

test("searching from home navigates to google search page", async ({
    page,
}) => {
    await bootDesktop(page);
    await openSafari(page);

    const input = page.getByPlaceholder("Search with Google");

    await input.fill("aurora");
    await input.press("Enter");

    await expect(page.getByTestId("google-search-meta")).toBeVisible();

    await expect(page.getByText("AURORA Internal Network")).toBeVisible();
});

test("suggestions appear and can be clicked", async ({ page }) => {
    await bootDesktop(page);
    await openSafari(page);

    const input = page.getByPlaceholder("Search with Google");

    await input.fill("test");
    await input.click();

    await expect(page.getByText('Search Google for "test"')).toBeVisible();

    await page.getByText('Search Google for "test"').click();

    await expect(page.getByText("About", { exact: false })).toBeVisible();
});

test("suggestions close when clicking outside", async ({ page }) => {
    await bootDesktop(page);
    await openSafari(page);

    const input = page.getByPlaceholder("Search with Google");

    await input.fill("test");
    await input.click();

    await expect(page.getByText('Search Google for "test"')).toBeVisible();

    await page.getByTestId("safari-home").click();

    await expect(page.getByText('Search Google for "test"')).toHaveCount(0);
});

test("internal route opens when searching aurora", async ({ page }) => {
    await bootDesktop(page);
    await openSafari(page);

    const input = page.getByPlaceholder("Search with Google");

    await input.fill("aurora");
    await input.press("Enter");

    await page.getByText("AURORA Internal Network").click();

    await expect(
        page.getByText("Restricted scientific access portal."),
    ).toBeVisible();
});

test("back button returns to previous page", async ({ page }) => {
    await bootDesktop(page);
    await openSafari(page);

    const input = page.getByPlaceholder("Search with Google");

    await input.fill("aurora");
    await input.press("Enter");

    await page.getByTestId("back-button").click();

    await expect(page.getByPlaceholder("Search with Google")).toBeVisible();

    await page.getByTestId("forward-button").click();
    await expect(page.getByText("AURORA Internal Network")).toBeVisible();
});
