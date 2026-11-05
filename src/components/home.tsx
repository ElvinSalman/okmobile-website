"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  Tablet,
  Headphones,
  Watch,
  Gamepad2,
  House,
  MapPin,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { categories, products } from "@/lib/products";
import { ProductCard } from "./product-card";
import { Button } from "./ui/button";
const icons = [Smartphone, Tablet, Headphones, Watch, Gamepad2, House];
export function Home() {
  const t = useTranslations();
  const l = useLocale();
  return (
    <>
      <div className="container">
        <section className="hero">
          <div className="hero-copy">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
            >
              <span className="eyebrow">
                <i /> {t("heroTag")}
              </span>
              <h1>{t("heroTitle")}</h1>
              <p>{t("heroText")}</p>
              <Button asChild>
                <Link href={`/${l}/catalog`}>
                  {t("explore")}
                  <ArrowUpRight size={19} />
                </Link>
              </Button>
              <div className="hero-pagination">
                <span className="selected">01</span>
                <i />
                <span>02</span>
                <span>03</span>
                <span className="hero-scroll">OK MOBILE / THE COLLECTION</span>
              </div>
            </motion.div>
          </div>
          <div className="hero-art" aria-label={t("illustration")} role="img">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="hero-background-word">hello.</span>
            <Image
              className="hero-headphones"
              src="/art/headphones.svg"
              alt=""
              width={500}
              height={500}
              priority
            />
            <Image
              className="hero-phone"
              src="/art/phone-orange.svg"
              alt=""
              width={500}
              height={500}
              priority
            />
            <div className="hero-art-label">
              <span>DESIGNED FOR YOUR EVERYDAY</span>
              <ArrowUpRight size={26} />
            </div>
            <span className="hero-sample">{t("sample")}</span>
          </div>
        </section>
        <p className="demo-notice">
          <span />
          <span>{t("demo")}</span>
        </p>
        <section className="category-section">
          <div className="section-heading">
            <div>
              <h2>{t("categories")}</h2>
              <p>{t("categoriesText")}</p>
            </div>
            <Link className="text-link" href={`/${l}/catalog`}>
              {t("all")}
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="category-grid">
            {categories.map((c, i) => {
              const Icon = icons[i];
              return (
                <Link
                  key={c}
                  href={`/${l}/catalog?category=${c}`}
                  className="category-tile"
                >
                  <Icon size={32} strokeWidth={1.3} />
                  <span>{t(c)}</span>
                  <ArrowUpRight className="category-arrow" size={15} />
                </Link>
              );
            })}
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow orange">{t("curated")}</span>
              <h2>{t("featured")}</h2>
              <p>{t("featuredText")}</p>
            </div>
            <Link className="text-link" href={`/${l}/catalog`}>
              {t("all")}
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="product-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
        <section className="editorial">
          <div>
            <span className="eyebrow">{t("audio")}</span>
            <h2>{t("editorial")}</h2>
            <p>{t("editorialText")}</p>
            <Button variant="outline" asChild>
              <Link href={`/${l}/catalog?category=audio`}>
                {t("audioLink")}
                <ArrowUpRight size={18} />
              </Link>
            </Button>
          </div>
          <div className="editorial-art">
            <span>sound.</span>
            <Image
              src="/art/headphones.svg"
              alt={t("illustration")}
              width={500}
              height={500}
            />
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow orange">{t("latest")}</span>
              <h2>{t("newArrivals")}</h2>
            </div>
            <Link className="text-link" href={`/${l}/catalog?page=2`}>
              {t("all")}
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="product-grid">
            {products.slice(4, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
        <section className="brand-section">
          <span className="eyebrow">{t("brands")}</span>
          <div className="brands">
            {["Apple", "SAMSUNG", "dyson", "SONY", "roborock", "DJI"].map(
              (b) => (
                <Link
                  href={`/${l}/catalog?brand=${b === "SONY" ? "Sony" : b === "SAMSUNG" ? "Samsung" : b === "dyson" ? "Dyson" : b === "roborock" ? "Roborock" : b}`}
                  key={b}
                >
                  {b}
                </Link>
              ),
            )}
          </div>
        </section>
        <section className="trust-grid">
          {[Sparkles, MapPin, MessageCircle].map((Icon, i) => (
            <div key={i}>
              <Icon size={26} strokeWidth={1.4} />
              <div>
                <h3>{t(`trust${i + 1}`)}</h3>
                <p>{t(`trust${i + 1}Text`)}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
