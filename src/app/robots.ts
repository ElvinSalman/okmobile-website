import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/*/cart", "/*/wishlist", "/*/search"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
