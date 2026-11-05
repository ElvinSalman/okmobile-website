import Link from "next/link";
export default function NotFound() {
  return (
    <html lang="az">
      <body>
        <main className="empty-state">
          <span className="giant-number">404</span>
          <h1>Bu səhifə tapılmadı.</h1>
          <Link className="button button-primary" href="/az">
            Ana səhifə
          </Link>
          <Link href="/ru">Русский</Link>
          <Link href="/en">English</Link>
        </main>
      </body>
    </html>
  );
}
