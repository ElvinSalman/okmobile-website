import "./globals.css";
import { siteUrl } from "@/lib/metadata";
export const metadata = { metadataBase: new URL(siteUrl()) };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
