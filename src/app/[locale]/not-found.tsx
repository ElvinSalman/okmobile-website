"use client";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  const t = useTranslations();
  const l = useLocale();
  return (
    <div className="container empty-state">
      <span className="giant-number">404</span>
      <h1>{t("notFound")}</h1>
      <p>{t("notFoundText")}</p>
      <Button asChild>
        <Link href={`/${l}`}>{t("home")}</Link>
      </Button>
    </div>
  );
}
