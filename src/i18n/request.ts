import { getRequestConfig } from "next-intl/server";
import { messages } from "@/lib/i18n";
export default getRequestConfig(async () => ({
  locale: "az",
  messages: messages.az,
  timeZone: "Asia/Baku",
}));
