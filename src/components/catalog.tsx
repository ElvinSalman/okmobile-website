"use client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import {
  categories,
  products,
  filterProducts,
  type Filters,
} from "@/lib/products";
import { ProductCard } from "./product-card";
import { Button } from "./ui/button";
export function Catalog({ search = false }: { search?: boolean }) {
  const t = useTranslations();
  const l = useLocale();
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const f: Filters = Object.fromEntries(params.entries());
  const filtered = filterProducts(f);
  const page = Math.min(
    Math.max(1, Number(f.page) || 1),
    Math.max(1, Math.ceil(filtered.length / 8)),
  );
  const update = (key: string, value: string) => {
    const p = new URLSearchParams(params);
    if (value) p.set(key, value);
    else p.delete(key);
    if (key !== "page") p.delete("page");
    router.push(`${path}?${p}`, { scroll: false });
  };
  const fields = (
    <>
      <div className="section-heading">
        <h3>{t("filters")}</h3>
        <button className="text-link orange" onClick={() => router.push(path)}>
          {t("clear")}
        </button>
      </div>
      <label>
        {t("category")}
        <select
          aria-label={t("category")}
          value={f.category || ""}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">{t("all")}</option>
          {categories.map((c) => (
            <option value={c} key={c}>
              {t(c)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("brand")}
        <select
          aria-label={t("brand")}
          value={f.brand || ""}
          onChange={(e) => update("brand", e.target.value)}
        >
          <option value="">{t("all")}</option>
          {[...new Set(products.map((p) => p.brand))].map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label>
        {t("min")}
        <input
          aria-label={t("min")}
          type="number"
          min="0"
          max="10000"
          placeholder="0 ₼"
          value={f.min || ""}
          onChange={(e) => update("min", e.target.value)}
        />
      </label>
      <label>
        {t("maxPrice")}
        <input
          aria-label={t("maxPrice")}
          type="number"
          min="0"
          max="10000"
          placeholder="10 000 ₼"
          value={f.max || ""}
          onChange={(e) => update("max", e.target.value)}
        />
      </label>
      <p className="small muted">{t("unverified")}</p>
    </>
  );
  return (
    <div className="container page-content">
      <div className="breadcrumbs">
        <a href={`/${l}`}>{t("home")}</a>
        <span>/</span>
        {t(search ? "searchTitle" : "catalog")}
      </div>
      <div className="page-title">
        <span className="eyebrow orange">OK MOBILE / THE COLLECTION</span>
        <h1>{t(search ? "searchTitle" : "catalog")}</h1>
        <p>{t("demo")}</p>
      </div>
      <form className="catalog-search" action={path}>
        <Search size={20} />
        <input
          key={f.q}
          name="q"
          defaultValue={f.q || ""}
          placeholder={t("search")}
          aria-label={t("searchFor")}
        />
        {f.category && (
          <input type="hidden" name="category" value={f.category} />
        )}
        <Button type="submit">
          {t("searchFor")}
          <ArrowRight size={16} />
        </Button>
      </form>
      <div className="catalog-layout">
        <aside className="filters desktop-filters">{fields}</aside>
        <div>
          <div className="catalog-toolbar">
            <span>
              {filtered.length} {t("results")}
            </span>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <Button variant="outline" className="filter-trigger">
                  <SlidersHorizontal size={16} />
                  {t("filters")}
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="menu-panel filters">
                  <div className="section-heading">
                    <Dialog.Title>{t("filters")}</Dialog.Title>
                    <Dialog.Close asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={t("close")}
                      >
                        <X />
                      </Button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="small muted">
                    {t("demo")}
                  </Dialog.Description>
                  {fields}
                  <Button onClick={() => setOpen(false)}>{t("all")}</Button>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
            <label className="sort-label">
              <span>{t("sort")}</span>
              <select
                aria-label={t("sort")}
                value={f.sort || ""}
                onChange={(e) => update("sort", e.target.value)}
              >
                {["recommended", "priceLow", "priceHigh", "name"].map(
                  (v, i) => (
                    <option value={i === 0 ? "" : v} key={v}>
                      {t(v)}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
          {filtered.length ? (
            <div className="product-grid catalog-grid">
              {filtered.slice((page - 1) * 8, page * 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={36} />
              <h2>{t("noResults")}</h2>
              <p>{t("trySearch")}</p>
              <Button onClick={() => router.push(path)}>{t("clear")}</Button>
            </div>
          )}
          {filtered.length > 8 && (
            <nav className="pagination" aria-label={t("page")}>
              <Button
                variant="outline"
                aria-label={t("previous")}
                disabled={page === 1}
                onClick={() => update("page", String(page - 1))}
              >
                <ArrowLeft size={17} />
              </Button>
              <span>
                {page} / {Math.ceil(filtered.length / 8)}
              </span>
              <Button
                variant="outline"
                aria-label={t("next")}
                disabled={page >= Math.ceil(filtered.length / 8)}
                onClick={() => update("page", String(page + 1))}
              >
                <ArrowRight size={17} />
              </Button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
