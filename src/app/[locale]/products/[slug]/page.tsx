import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import { isLocale, locales, messages } from "@/lib/i18n";
import { metadata } from "@/lib/metadata";
import { ProductDetail } from "@/components/product-detail";
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    products.map((p) => ({ locale, slug: p.slug })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const p = getProduct(slug);
  return metadata(
    locale,
    `/products/${slug}`,
    p
      ? `${p.name} · ${isLocale(locale) ? messages[locale].sample : "Demo"}`
      : undefined,
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const p = getProduct(slug);
  if (!p || !isLocale(locale)) notFound();
  return <ProductDetail product={p} />;
}
