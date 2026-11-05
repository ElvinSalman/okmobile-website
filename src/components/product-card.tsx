"use client";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Plus, Check, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { type Product, money } from "@/lib/products";
import { useShop } from "@/lib/store";
import { Button } from "./ui/button";
export function ProductCard({ product: p }: { product: Product }) {
  const t = useTranslations();
  const l = useLocale();
  const saved = useShop((s) => s.wishlist.includes(p.id));
  const toggle = useShop((s) => s.toggle);
  const add = useShop((s) => s.add);
  const [added, setAdded] = useState(false);
  return (
    <article className="product-card">
      <div className="product-visual">
        <span className="sample-badge">{t("sample")}</span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`${saved ? t("remove") : t("save")}: ${p.name}`}
          aria-pressed={saved}
          className={`save-button ${saved ? "saved" : ""}`}
          onClick={() => toggle(p.id)}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </Button>
        <Link
          href={`/${l}/products/${p.slug}`}
          aria-label={`${t("view")}: ${p.name}`}
        >
          <Image
            src={`/art/${p.art}.svg`}
            alt={p.name}
            width={500}
            height={500}
          />
        </Link>
        <span className="product-colors">
          {p.colors.map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
      </div>
      <div className="product-info">
        <span className="eyebrow">{p.brand}</span>
        <Link href={`/${l}/products/${p.slug}`} className="product-name">
          {p.name}
          <ArrowUpRight size={16} />
        </Link>
        <p className="muted configuration">{p.storage?.[0] || t(p.category)}</p>
        <div className="product-bottom">
          <div>
            <small>{t("samplePrice")}</small>
            <strong>{money(p.demoPrice, l)}</strong>
          </div>
          <Button
            size="icon"
            variant="outline"
            aria-label={`${t("add")}: ${p.name}`}
            onClick={() => {
              add(p.id, p.colors[0], p.storage?.[0] || "");
              setAdded(true);
              setTimeout(() => setAdded(false), 1600);
            }}
          >
            {added ? <Check size={19} /> : <Plus size={20} />}
          </Button>
        </div>
      </div>
    </article>
  );
}
