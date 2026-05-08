export type V2Locale = "ar" | "en";

export type LocalizedText = {
  ar: string;
  en: string;
};

export function normalizeLocale(locale: string): V2Locale {
  return locale === "ar" ? "ar" : "en";
}

export function pickText(value: LocalizedText, locale: V2Locale): string {
  return value[locale];
}

export function formatV2Number(value: number, locale: V2Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatV2Money(value: number, locale: V2Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    currency: "EGP",
    maximumFractionDigits: 0,
    notation: "compact",
    style: "currency",
  }).format(value);
}
