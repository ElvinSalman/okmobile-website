import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";
export default async function Root() {
  const preference = (await cookies()).get("NEXT_LOCALE")?.value || "az";
  redirect(`/${isLocale(preference) ? preference : "az"}`);
}
