"use client";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  ArrowUpRight,
  MapPin,
  ArrowRight,
  Camera as Instagram,
} from "lucide-react";
import { inquirySchema } from "@/lib/inquiry";
import { Button } from "./ui/button";
export function Contact() {
  const t = useTranslations();
  const params = useSearchParams();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="container page-content">
      <div className="page-title">
        <span className="eyebrow orange">OK MOBILE / BAKU</span>
        <h1>{t("contactTitle")}</h1>
        <p>{t("contactText")}</p>
      </div>
      <div className="contact-layout">
        <section className="contact-info">
          <div className="contact-map">
            <div className="map-grid" />
            <MapPin size={43} strokeWidth={1.4} />
            <span>BAKU</span>
            <span className="map-caption">D. ƏLİYEVA / AF MALL</span>
          </div>
          <h2>{t("location")}</h2>
          <p>{t("address")}</p>
          <small className="muted">{t("addressNote")}</small>
          <a
            href="https://www.google.com/maps/search/?api=1&query=200+Dilara+Aliyeva+Baku"
            className="text-link"
          >
            {t("map")} <ArrowUpRight size={17} />
          </a>
          <a href="https://tap.az/shops/okmobile" className="text-link">
            {t("store")}
            <ArrowUpRight size={17} />
          </a>
          <a
            href="https://www.instagram.com/okmobile.az/"
            className="text-link"
          >
            <Instagram size={17} />
            {t("instagram")}
            <ArrowUpRight size={17} />
          </a>
        </section>
        <form
          className="contact-form"
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            const parsed = inquirySchema.safeParse(Object.fromEntries(form));
            if (!parsed.success) {
              setStatus("invalid");
              return;
            }
            setBusy(true);
            setStatus("");
            try {
              const res = await fetch("/api/inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
              });
              setStatus(
                res.ok
                  ? "sent"
                  : res.status === 503
                    ? "unavailable"
                    : res.status === 400
                      ? "invalid"
                      : "failed",
              );
            } catch {
              setStatus("failed");
            } finally {
              setBusy(false);
            }
          }}
        >
          <h2>{t("inquiry")}</h2>
          <label htmlFor="name">{t("yourName")}</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
          />
          <label htmlFor="email">{t("email")}</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
          <label htmlFor="message">{t("message")}</label>
          <textarea
            id="message"
            name="message"
            rows={7}
            defaultValue={params.get("items") || ""}
            required
            minLength={10}
            maxLength={5000}
          />
          <p className="small muted">{t("privacy")}</p>
          <Button disabled={busy} type="submit">
            {t(busy ? "sending" : "send")}
            <ArrowRight size={17} />
          </Button>
          {status && (
            <p
              className={`form-status ${status === "sent" ? "success" : ""}`}
              role="status"
            >
              {t(status)}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
