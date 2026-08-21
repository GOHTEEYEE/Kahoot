export type AppLocale = "en" | "zh" | "ms";

export const LOCALES: { id: AppLocale; label: string }[] = [
  { id: "en", label: "English" },
  { id: "zh", label: "中文" },
  { id: "ms", label: "Bahasa" },
];

export function isAppLocale(v: string): v is AppLocale {
  return v === "en" || v === "zh" || v === "ms";
}

/** UI labels that only have zh + en sources (ms uses English). */
export function pickLocalized(zh: string, en: string, locale: AppLocale): string {
  return locale === "zh" ? zh : en;
}
