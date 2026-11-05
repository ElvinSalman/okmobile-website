"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Share2, Plus, Check, ArrowUpRight, Info } from "lucide-react";
import { type Product, money, products } from "@/lib/products";
import { useShop } from "@/lib/store";
import { Button } from "./ui/button";
import { ProductCard } from "./product-card";
export function ProductDetail({ product: p }: { product: Product }) {
  const t = useTranslations();
  const l = useLocale();
  const [color, setColor] = useState(p.colors[0]);
  const [storage, setStorage] = useState(p.storage?.[0] || "");
  const [view, setView] = useState(0);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);
  const saved = useShop((s) => s.wishlist.includes(p.id));
  const toggle = useShop((s) => s.toggle);
  const add = useShop((s) => s.add);
  return (
    <div className="container page-content">
      <nav className="breadcrumbs" aria-label={t("breadcrumb")}>
        <Link href={`/${l}`}>{t("home")}</Link>
        <span>/</span>
        <Link href={`/${l}/catalog`}>{t("catalog")}</Link>
        <span>/</span>
        <span>{p.name}</span>
      </nav>
      <div className="detail-layout">
        <section className="gallery" aria-label={t("gallery")}>
          <div className="gallery-main">
            <span className="sample-badge">{t("sample")}</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={view + color}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ transform: view ? "rotate(8deg) scale(1.15)" : "" }}
              >
                <Image
                  src={`/art/${p.art}.svg`}
                  alt={`${p.name} — ${t(view ? "back" : "front")}`}
                  width={600}
                  height={600}
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="thumbnails">
            {[0, 1].map((v) => (
              <button
                aria-label={t(v ? "back" : "front")}
                aria-pressed={view === v}
                key={v}
                onClick={() => setView(v)}
                className={view === v ? "selected" : ""}
              >
                <Image
                  style={{ transform: v ? "rotate(12deg) scale(.85)" : "" }}
                  src={`/art/${p.art}.svg`}
                  alt=""
                  width={80}
                  height={80}
                />
              </button>
            ))}
          </div>
          <small className="muted">{t("illustration")}</small>
        </section>
        <section className="detail-copy">
          <span className="eyebrow orange">
            {p.brand} / {t(p.category)}
          </span>
          <h1>{p.name}</h1>
          <p>{t("description")}</p>
          <div className="detail-price">
            <small>{t("samplePrice")}</small>
            <strong>{money(p.demoPrice, l)}</strong>
          </div>
          <p className="verification-note">
            <Info size={16} />
            {t("unverified")}
          </p>
          {p.storage && (
            <fieldset>
              <legend>{t("storage")}</legend>
              <div className="variant-options">
                {p.storage.map((s) => (
                  <button
                    key={s}
                    aria-pressed={storage === s}
                    className={storage === s ? "selected" : ""}
                    onClick={() => setStorage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <fieldset>
            <legend>
              {t("color")} <small className="muted">· {t("finish")}</small>
            </legend>
            <div className="color-options">
              {p.colors.map((c, i) => (
                <button
                  key={c}
                  aria-label={`${t("color")} ${i + 1}`}
                  aria-pressed={c === color}
                  onClick={() => setColor(c)}
                  className={c === color ? "selected" : ""}
                >
                  <span style={{ background: c }} />
                </button>
              ))}
            </div>
          </fieldset>
          <div className="detail-actions">
            <Button
              onClick={() => {
                add(p.id, color, storage);
                setAdded(true);
                setTimeout(() => setAdded(false), 1800);
              }}
            >
              {added ? <Check size={18} /> : <Plus size={18} />}{" "}
              {t(added ? "added" : "add")}
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label={t("save")}
              aria-pressed={saved}
              onClick={() => toggle(p.id)}
            >
              <Heart size={20} fill={saved ? "currentColor" : "none"} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label={t("share")}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <Share2 size={19} />
            </Button>
          </div>
          {copied && <p role="status">{t("copied")}</p>}
          <small className="muted">{t("delivery")}</small>
          <div className="specifications">
            <h2>{t("specs")}</h2>
            <dl>
              {[
                [t("brand"), p.brand],
                [t("model"), p.model],
                [t("storage"), storage || "—"],
                [t("availability"), t("unknown")],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <details>
            <summary>{t("source")}</summary>
            <p>
              {t("sourceNote")}{" "}
              <a href={p.storeReference} className="text-link">
                Tap.az <ArrowUpRight size={14} />
              </a>
            </p>
            <p>
              {t("checked")}: {p.checkedAt}
            </p>
          </details>
        </section>
      </div>
      <section className="section">
        <div className="section-heading">
          <h2>{t("related")}</h2>
        </div>
        <div className="product-grid">
          {products
            .filter((v) => v.id !== p.id)
            .sort(
              (a, b) =>
                Number(b.category === p.category) -
                Number(a.category === p.category),
            )
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </div>
  );
}
