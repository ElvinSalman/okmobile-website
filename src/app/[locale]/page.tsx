import { Home } from "@/components/home";
import { metadata } from "@/lib/metadata";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return metadata((await params).locale);
}
export default function Page() {
  return <Home />;
}
