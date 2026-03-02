import { test, expect } from "@playwright/test";

test.describe("Desktop smoke tests", () => {
  test("homepage loads with hero and sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("text=Automate your aquarium")).toBeVisible();

    // Desktop nav links visible (not hamburger)
    await expect(page.getByRole("link", { name: "Shop", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Species", exact: true })).toBeVisible();

    // Key homepage sections
    await expect(page.getByRole("heading", { name: "Featured Products" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Shop by Category" })).toBeVisible();
  });

  test("desktop search bar is visible and functional", async ({ page }) => {
    await page.goto("/");
    const searchBar = page.getByPlaceholder("Search products… (⌘K)");
    await expect(searchBar).toBeVisible();

    await searchBar.fill("neon");
    await searchBar.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=neon/);
    await expect(page.locator("text=/\\d+ products? found/")).toBeVisible();
  });

  test("product cards render on shop page", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.locator("text=Shop All Collections")).toBeVisible();
    await expect(page.locator("text=/\\$\\d+/").first()).toBeVisible();
  });

  test("species page renders cards", async ({ page }) => {
    await page.goto("/species");
    await expect(page.getByRole("heading", { name: "Species Care Sheets" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Neon Tetra" })).toBeVisible();
  });

  test("cart drawer opens", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Open cart").click();
    await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
  });

  test("key pages load without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const pages = [
      "/",
      "/collections",
      "/species",
      "/guides",
      "/automation",
      "/wishlist",
      "/tools/tank-calculator",
      "/tools/build-your-tank",
      "/search",
      "/live",
    ];

    for (const path of pages) {
      await page.goto(path);
      await expect(page.locator("header")).toBeVisible();
    }

    expect(errors).toHaveLength(0);
  });
});
