"use client";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Heart,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Minus,
  Plus,
  Copy,
  Check,
} from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { useShop } from "@/lib/store";
import { products, money } from "@/lib/products";
import { Button } from "./ui/button";
import { ProductCard } from "./product-card";
const subscribe = () => () => {};
export function Collections({ wishlist = false }: { wishlist?: boolean }) {
  const t = useTranslations();
  const l = useLocale();
  const store = useShop();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [copied, setCopied] = useState(false);
  const saved = products.filter((p) => store.wishlist.includes(p.id));
  const rows = store.cart.flatMap((item) => {
    const p = products.find((p) => p.id === item.id);
    return p ? [{ ...item, product: p }] : [];
  });
  const total = rows.reduce(
    (sum, i) => sum + i.product.demoPrice * i.quantity,
    0,
  );
  const empty = wishlist ? !saved.length : !rows.length;
  const draft = rows
    .map((i) => `${i.product.name} ${i.storage} (${i.color}) × ${i.quantity}`)
    .join("\n");
  return (
    <div className="container page-content">
      <div className="page-title">
        <span className="eyebrow orange">{t("curated")}</span>
        <h1>{t(wishlist ? "wishlist" : "cart")}</h1>
        <p>{t("demo")}</p>
      </div>
      {!mounted ? (
        <div className="loading-shimmer" />
      ) : empty ? (
        <div className="empty-state">
          {wishlist ? (
            <Heart size={42} strokeWidth={1} />
          ) : (
            <ShoppingBag size={42} strokeWidth={1} />
          )}
          <h2>{t(wishlist ? "emptyWish" : "emptyCart")}</h2>
          <p>{t("emptyText")}</p>
          <Button asChild>
            <Link href={`/${l}/catalog`}>
              {t("explore")}
              <ArrowRight size={17} />
            </Link>
          </Button>
        </div>
      ) : wishlist ? (
        <div className="product-grid">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {rows.map((i) => (
              <article className="cart-row" key={i.key}>
                <Link
                  className="cart-image"
                  href={`/${l}/products/${i.product.slug}`}
                >
                  <Image
                    src={`/art/${i.product.art}.svg`}
                    alt={i.product.name}
                    width={130}
                    height={130}
                  />
                </Link>
                <div className="cart-item-info">
                  <small className="muted">{i.product.brand}</small>
                  <Link href={`/${l}/products/${i.product.slug}`}>
                    <h3>{i.product.name}</h3>
                  </Link>
                  <p className="small muted">
                    {i.storage}{" "}
                    <span
                      className="inline-color"
                      style={{ background: i.color }}
                    />
                  </p>
                  <small>
                    {t("samplePrice")}: {money(i.product.demoPrice, l)}
                  </small>
                  <div className="quantity">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${t("quantity")} − ${i.product.name}`}
                      disabled={i.quantity === 1}
                      onClick={() => store.quantity(i.key, i.quantity - 1)}
                    >
                      <Minus size={14} />
                    </Button>
                    <span>{i.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${t("quantity")} + ${i.product.name}`}
                      disabled={i.quantity === 99}
                      onClick={() => store.quantity(i.key, i.quantity + 1)}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`${t("remove")}: ${i.product.name}`}
                  onClick={() => store.remove(i.key)}
                >
                  <Trash2 size={18} />
                </Button>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>{t("summary")}</h2>
            <div className="total-row">
              <span>{t("total")}</span>
              <strong>{money(total, l)}</strong>
            </div>
            <p>{t("orderNote")}</p>
            <Button asChild>
              <Link href={`/${l}/contact?items=${encodeURIComponent(draft)}`}>
                {t("inquiry")}
                <ArrowRight size={17} />
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(draft);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
              {t(copied ? "copyDone" : "copyInquiry")}
            </Button>
            <Link href={`/${l}/catalog`} className="text-link">
              {t("continue")}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
