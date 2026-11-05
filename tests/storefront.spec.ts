import { test, expect } from "@playwright/test";
test("locale routes, direct product refresh, metadata and original images", async ({
  page,
}) => {
  for (const locale of ["az", "ru", "en"]) {
    await page.goto(`/${locale}/products/iphone-17-pro`);
    await expect(page.locator("h1")).toHaveText("iPhone 17 Pro");
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await page.reload();
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(
      4,
    );
    expect(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.every(
            (i) =>
              (i as HTMLImageElement).complete &&
              (i as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    ).toBeTruthy();
  }
});
test("search, category, brand, price and sort use URL state", async ({
  page,
}) => {
  await page.goto(
    "/en/catalog?category=phones&brand=Apple&max=3000&sort=priceLow",
  );
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-name")).toContainText("iPhone 17 Pro");
  await page.goto("/en/search?q=nonexistent-item");
  await expect(
    page.getByRole("heading", { name: "Nothing here yet" }),
  ).toBeVisible();
  await page.goto("/en/search?q=buds");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.goto("/en/catalog");
  await page.getByLabel("Brand", { exact: true }).selectOption("Samsung");
  await expect(page).toHaveURL(/brand=Samsung/);
  await expect(page.locator(".product-card")).toHaveCount(4);
});
test("variants, cart quantities, persistence, wishlist and retained language route", async ({
  page,
}) => {
  await page.goto("/en/products/iphone-17-pro");
  await page.getByRole("button", { name: "512 GB", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await page.getByRole("button", { name: "Save product", exact: true }).click();
  await page.goto("/en/cart");
  await expect(page.locator(".cart-row")).toHaveCount(1);
  await expect(page.locator(".cart-item-info")).toContainText("512 GB");
  await page.getByRole("button", { name: "Quantity + iPhone 17 Pro" }).click();
  await expect(page.locator(".quantity>span")).toHaveText("2");
  await page.reload();
  await expect(page.locator(".quantity>span")).toHaveText("2");
  await page.goto("/en/wishlist");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.goto("/en/products/iphone-17-pro");
  await page.getByLabel("Language", { exact: true }).selectOption("ru");
  await expect(page).toHaveURL(/\/ru\/products\/iphone-17-pro/);
  await page.goto("/en/cart");
  await page.getByRole("button", { name: "Remove: iPhone 17 Pro" }).click();
  await expect(page.locator(".cart-row")).toHaveCount(0);
});
test("inquiry validates and reports unavailable delivery honestly", async ({
  page,
  request,
}) => {
  await page.goto("/en/contact");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Please enter");
  await page.getByLabel("Your name").fill("Demo Tester");
  await page.getByLabel("Email address").fill("tester@example.com");
  await page
    .getByLabel("Your message")
    .fill("Please confirm the current price.");
  await page.getByRole("button", { name: "Send inquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Nothing was sent");
  const result = await request.post("/api/inquiry", { data: { name: "x" } });
  expect(result.status()).toBe(400);
});
test("themes, mobile filters, menu and responsive widths", async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/en",
      "/en/catalog",
      "/en/products/iphone-17-pro",
      "/en/contact",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
    }
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/en/catalog");
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Toggle color theme" }).click();
  const theme = await page.locator("html").getAttribute("class");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("class", theme!);
});
test("routes, sitemap, robots, 404 and no browser runtime errors", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of [
    "/en",
    "/az/about",
    "/ru/promotions",
    "/en/search",
    "/en/wishlist",
    "/en/unknown-page",
  ]) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(path.includes("unknown") ? 404 : 200);
  }
  for (const path of ["/sitemap.xml", "/robots.txt", "/opengraph-image"])
    expect((await request.get(path)).status()).toBe(200);
  expect(errors).toEqual([]);
});
