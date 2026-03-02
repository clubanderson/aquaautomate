import { test, expect } from "@playwright/test";

test.describe("Mobile smoke tests", () => {
  test("homepage loads and navigation works", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("text=Automate your aquarium")).toBeVisible();

    // Hamburger menu opens
    await page.getByLabel("Toggle menu").click();
    await expect(page.getByRole("link", { name: "Shop", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Species", exact: true })).toBeVisible();
  });

  test("search page has visible input on mobile", async ({ page }) => {
    await page.goto("/search");
    const input = page.getByRole("searchbox", { name: "Search products…" });
    await expect(input).toBeVisible();

    // Type and submit
    await input.fill("neon");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/search\?q=neon/);
    await expect(page.locator("text=/\\d+ products? found/")).toBeVisible();
  });

  test("search icon navigates to search page", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search").click();
    await expect(page).toHaveURL("/search");
    await expect(page.getByRole("searchbox", { name: "Search products…" })).toBeVisible();
  });

  test("product cards render on shop page", async ({ page }) => {
    await page.goto("/collections");
    await expect(page.locator("text=Shop All Collections")).toBeVisible();
    // At least one product card with a price should be visible
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
