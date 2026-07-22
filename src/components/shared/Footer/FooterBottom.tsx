"use client";

import { useTranslations } from "next-intl";

import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";

export type FooterBottomProps = Record<string, never>;

/** Bottom bar: copyright + theme/locale controls. */
export function FooterBottom({}: FooterBottomProps) {
  const t = useTranslations("home");

  return (
    <div data-foot className="mt-12 flex flex-wrap items-center justify-between gap-3.5 pt-6.5 text-[13px] text-[color:var(--text-3)]">
      <span>{t("foot.rights")}</span>
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <LocaleSwitcher />
      </div>
    </div>
  );
}
