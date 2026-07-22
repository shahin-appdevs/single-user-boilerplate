"use client";

import { useLocale } from "next-intl";

import { Toaster as UiToaster } from "@/components/ui/sonner";
import { isLocale, isRtl } from "@/i18n/routing";

export function Toaster() {
  const locale = useLocale();
  const rtl = isLocale(locale) && isRtl(locale);

  return <UiToaster position={rtl ? "top-left" : "top-right"} />;
}
