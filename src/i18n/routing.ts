import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localePrefix = "always";

export const rtlLocales: readonly Locale[] = ["ar"];

export const isRtl = (locale: Locale): boolean => rtlLocales.includes(locale);

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
});
