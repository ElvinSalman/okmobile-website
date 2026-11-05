import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const origin = process.argv[2] || "https://okmobile-website.vercel.app";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
for (const locale of ["az", "ru", "en"]) {
  for (const path of ["", "/catalog", "/products/iphone-17-pro", "/contact"]) {
    const response = await page.goto(`${origin}/${locale}${path}`);
    if (response.status() !== 200)
      throw new Error(`${locale}${path}: ${response.status()}`);
    await page.locator("h1").waitFor();
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    if (canonical !== `${origin}/${locale}${path}`)
      throw new Error(`Wrong canonical: ${canonical}`);
  }
}
await page.goto(`${origin}/az/catalog?storage=512+GB`);
if ((await page.locator(".product-card").count()) !== 3)
  throw new Error("Storage filter failed");
mkdirSync("test-results", { recursive: true });
await page.goto(`${origin}/az`);
await page.screenshot({
  path: "test-results/production-desktop.png",
  fullPage: true,
});
await page.setViewportSize({ width: 375, height: 812 });
await page.screenshot({
  path: "test-results/production-mobile-light.png",
  fullPage: true,
});
await page.getByRole("button", { name: "Rəng mövzusunu dəyiş" }).click();
await page.screenshot({
  path: "test-results/production-mobile-dark.png",
  fullPage: true,
});
const response = await page.request.get(`${origin}/sitemap.xml`);
if (response.status() !== 200) throw new Error("Sitemap failed");
if (errors.length) throw new Error(errors.join("\n"));
console.log(
  "Production HTTPS verified: 12 localized routes, canonical URLs, storage filter, sitemap; desktop and mobile light/dark screenshots saved. No runtime errors.",
);
await browser.close();
