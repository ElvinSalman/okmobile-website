import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { isLocale, messages, locales } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { Header, Footer } from "@/components/shell";
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages[locale]}>
          <Providers>
            <a href="#main" className="skip-link">
              {messages[locale].skip}
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
