import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/catalog",
    "/about",
    "/contact",
    "/promotions",
    ...products.map((p) => `/products/${p.slug}`),
  ];
  return locales.flatMap((l) =>
    paths.map((path) => ({
      url: `${siteUrl()}/${l}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((v) => [v, `${siteUrl()}/${v}${path}`]),
        ),
      },
    })),
  );
}
