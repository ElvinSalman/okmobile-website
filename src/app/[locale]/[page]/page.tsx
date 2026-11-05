import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, MapPin } from "lucide-react";
import { Catalog } from "@/components/catalog";
import { Collections } from "@/components/collections";
import { Contact } from "@/components/contact";
import { Button } from "@/components/ui/button";
import { isLocale, messages, locales } from "@/lib/i18n";
import { metadata } from "@/lib/metadata";
const pages = [
  "catalog",
  "search",
  "cart",
  "wishlist",
  "about",
  "contact",
  "promotions",
] as const;
export function generateStaticParams() {
  return locales.flatMap((locale) => pages.map((page) => ({ locale, page })));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;
  const l = isLocale(locale) ? locale : "az";
  return metadata(
    l,
    `/${page}`,
    pages.includes(page as (typeof pages)[number])
      ? messages[l][
          page === "search" ? "searchTitle" : (page as (typeof pages)[number])
        ]
      : messages[l].notFound,
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;
  if (!isLocale(locale) || !pages.includes(page as (typeof pages)[number]))
    notFound();
  const t = messages[locale];
  if (page === "catalog" || page === "search")
    return (
      <Suspense>
        <Catalog search={page === "search"} />
      </Suspense>
    );
  if (page === "cart" || page === "wishlist")
    return <Collections wishlist={page === "wishlist"} />;
  if (page === "contact")
    return (
      <Suspense>
        <Contact />
      </Suspense>
    );
  return (
    <div className="container page-content">
      <div className="page-title">
        <span className="eyebrow orange">
          OK MOBILE / {t[page as "about" | "promotions"]}
        </span>
        <h1>{page === "about" ? t.aboutTitle : t.promoTitle}</h1>
        <p>{page === "about" ? t.aboutText : t.promoText}</p>
      </div>
      {page === "about" ? (
        <div className="about-grid">
          <section className="info-card">
            <MapPin size={32} />
            <h2>{t.location}</h2>
            <p>{t.address}</p>
            <p className="muted small">{t.addressNote}</p>
            <a className="text-link" href="https://tap.az/shops/okmobile">
              {t.store}
              <ArrowUpRight size={18} />
            </a>
          </section>
          <section className="info-card">
            <h2>{t.researchTitle}</h2>
            <p>{t.researchText}</p>
            <Button asChild variant="outline">
              <Link href={`/${locale}/contact`}>
                {t.contact}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </section>
        </div>
      ) : (
        <Button asChild>
          <Link href={`/${locale}/catalog`}>
            {t.explore}
            <ArrowRight size={18} />
          </Link>
        </Button>
      )}
    </div>
  );
}
