"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  Camera as Instagram,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useShop } from "@/lib/store";
import { Button } from "./ui/button";
import { useState } from "react";
export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const cart = useShop((s) => s.cart);
  const wish = useShop((s) => s.wishlist);
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="topline">
        <div className="container">
          <span>{t("tagline")}</span>
          <Link href={`/${locale}/contact`}>
            {t("location")} <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
      <header className="header">
        <div className="container header-main">
          <Link href={`/${locale}`} aria-label="OK Mobile" className="logo">
            ok<span className="logo-dot">.</span>
            <span className="logo-sub">mobile</span>
          </Link>
          <nav className="desktop-nav" aria-label={t("menu")}>
            {["catalog", "about", "contact"].map((p) => (
              <Link
                key={p}
                className={pathname.endsWith(p) ? "active" : ""}
                href={`/${locale}/${p}`}
              >
                {t(p)}
              </Link>
            ))}
          </nav>
          <form action={`/${locale}/search`} className="header-search">
            <Search size={18} />
            <input
              name="q"
              aria-label={t("searchFor")}
              placeholder={t("search")}
            />
          </form>
          <div className="header-actions">
            <select
              aria-label={t("language")}
              value={locale}
              onChange={(e) => {
                document.cookie = `NEXT_LOCALE=${e.target.value};path=/;max-age=31536000;SameSite=Lax`;
                window.location.assign(
                  pathname.replace(/^\/(az|en|ru)/, `/${e.target.value}`) +
                    window.location.search,
                );
              }}
            >
              {["az", "ru", "en"].map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
            <Button
              size="icon"
              variant="ghost"
              aria-label={t("theme")}
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <Sun size={19} className="sun" />
              <Moon size={19} className="moon" />
            </Button>
            <Link
              className="icon-button wish-link"
              href={`/${locale}/wishlist`}
              aria-label={`${t("wishlist")} (${wish.length})`}
            >
              <Heart size={20} />
              {wish.length > 0 && (
                <span className="counter">{wish.length}</span>
              )}
            </Link>
            <Link
              className="icon-button"
              href={`/${locale}/cart`}
              aria-label={`${t("cart")} (${cart.reduce((n, i) => n + i.quantity, 0)})`}
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="counter">
                  {cart.reduce((n, i) => n + i.quantity, 0)}
                </span>
              )}
            </Link>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="mobile-menu"
                  aria-label={t("menu")}
                >
                  <Menu size={22} />
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="menu-panel">
                  <div className="section-heading">
                    <Dialog.Title>OK Mobile</Dialog.Title>
                    <Dialog.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t("close")}
                      >
                        <X />
                      </Button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="muted">
                    {t("tagline")}
                  </Dialog.Description>
                  {[
                    "catalog",
                    "wishlist",
                    "cart",
                    "promotions",
                    "about",
                    "contact",
                  ].map((p) => (
                    <Link
                      onClick={() => setOpen(false)}
                      href={`/${locale}/${p}`}
                      key={p}
                    >
                      {t(p)} <ArrowRight size={18} />
                    </Link>
                  ))}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
        <form action={`/${locale}/search`} className="mobile-search">
          <Search size={17} />
          <input
            name="q"
            placeholder={t("search")}
            aria-label={t("searchFor")}
          />
        </form>
      </header>
    </>
  );
}
export function Footer() {
  const t = useTranslations();
  const l = useLocale();
  return (
    <footer>
      <div className="container footer-main">
        <div>
          <Link href={`/${l}`} className="logo">
            ok<span className="logo-dot">.</span>
            <span className="logo-sub">mobile</span>
          </Link>
          <p>{t("footerText")}</p>
          <a
            className="social"
            href="https://www.instagram.com/okmobile.az/"
            aria-label={t("instagram")}
          >
            <Instagram size={19} />
            <ArrowUpRight size={16} />
          </a>
        </div>
        <div>
          <h3>{t("shop")}</h3>
          {["catalog", "wishlist", "promotions"].map((p) => (
            <Link key={p} href={`/${l}/${p}`}>
              {t(p)}
            </Link>
          ))}
        </div>
        <div>
          <h3>{t("connect")}</h3>
          <Link href={`/${l}/about`}>{t("about")}</Link>
          <Link href={`/${l}/contact`}>{t("contact")}</Link>
          <a href="https://tap.az/shops/okmobile">
            Tap.az <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="footer-location">
          <h3>{t("location")}</h3>
          <p>
            <MapPin size={20} />
            {t("address")}
          </p>
          <small>{t("addressNote")}</small>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {t("rights")}
        </span>
        <span>{t("footerNote")}</span>
      </div>
    </footer>
  );
}
