"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations();
  return (
    <div className="container empty-state">
      <h1>{t("error")}</h1>
      <Button onClick={reset}>{t("retry")}</Button>
    </div>
  );
}
