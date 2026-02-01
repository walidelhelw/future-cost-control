import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !["ar", "en"].includes(locale)) {
    locale = "ar";
  }

  return {
    locale,
    messages: (await import(`../src/messages/${locale}.json`)).default,
  };
});
