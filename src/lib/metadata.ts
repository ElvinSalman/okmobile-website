import type { Metadata } from "next";
import { locales, isLocale, messages } from "./i18n";
export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, "");
}
export function metadata(locale: string, path = "", title?: string): Metadata {
  const l = isLocale(locale) ? locale : "az";
  const base = siteUrl();
  const name = title || messages[l].heroTitle.replace("\n", " ");
  const description = messages[l].demo;
  return {
    metadataBase: new URL(base),
    title: `${name} | OK Mobile`,
    description,
    alternates: {
      canonical: `${base}/${l}${path}`,
      languages: Object.fromEntries([
        ...locales.map((v) => [v, `${base}/${v}${path}`]),
        ["x-default", `${base}/az${path}`],
      ]),
    },
    openGraph: {
      title: `${name} | OK Mobile`,
      description,
      url: `${base}/${l}${path}`,
      siteName: "OK Mobile · Demo",
      locale: l === "az" ? "az_AZ" : l === "ru" ? "ru_RU" : "en_US",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: name, description },
    robots: { index: true, follow: true },
  };
}
