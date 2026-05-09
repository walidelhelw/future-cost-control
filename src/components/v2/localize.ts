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

const arabicDigits: Record<string, string> = {
  "0": "٠",
  "1": "١",
  "2": "٢",
  "3": "٣",
  "4": "٤",
  "5": "٥",
  "6": "٦",
  "7": "٧",
  "8": "٨",
  "9": "٩",
  ".": "٫",
};

function localizeCompactAmount(value: number, locale: V2Locale) {
  const normalized = value.toFixed(value >= 10 || Number.isInteger(value) ? 0 : 1);
  const trimmed = normalized.replace(/\.0$/, "");

  if (locale === "ar") {
    return trimmed.replace(/[0-9.]/g, (digit) => arabicDigits[digit] ?? digit);
  }

  return trimmed;
}

export function formatV2Money(value: number, locale: V2Locale): string {
  const absolute = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  const units =
    absolute >= 1_000_000_000
      ? { divisor: 1_000_000_000, en: "B", ar: "مليار" }
      : absolute >= 1_000_000
        ? { divisor: 1_000_000, en: "M", ar: "مليون" }
        : absolute >= 1_000
          ? { divisor: 1_000, en: "K", ar: "ألف" }
          : { divisor: 1, en: "", ar: "" };
  const amount = localizeCompactAmount(absolute / units.divisor, locale);

  if (locale === "ar") {
    return `${sign}${amount}${units.ar ? ` ${units.ar}` : ""} ج.م.`;
  }

  return `EGP ${sign}${amount}${units.en}`;
}
