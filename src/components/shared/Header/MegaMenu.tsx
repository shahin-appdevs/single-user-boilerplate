"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import type { NavItem } from "./nav.config";

export type MegaMenuProps = {
  /** A mega-kind nav item. */
  item: Extract<NavItem, { kind: "mega" }>;
  onNavigate: () => void;
};

export function MegaMenu({ item, onNavigate }: MegaMenuProps) {
  const t = useTranslations("home") as (key: string) => string;

  return (
    <div className="fixed inset-x-0  z-50 px-7 py-4">
      <div className="glass mx-auto max-h-[calc(100vh-var(--nav-h,72px)-2rem)] max-w-(--maxw) overflow-hidden rounded-3xl border-(--hairline-strong)">
       <div className="flex max-h-[calc(100vh-var(--nav-h,72px)-2rem)] gap-9 overflow-y-auto overscroll-contain p-9 [scrollbar-color:var(--hairline-strong)_transparent] scrollbar-thin [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--hairline-strong) [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="min-w-0 flex-1">
          <Link
            href={item.leadHref}
            onClick={onNavigate}
            className="font-heading mb-5 inline-flex items-center gap-2.5 text-2xl font-extrabold tracking-tight transition-[gap] hover:gap-3.5"
          >
            {t(item.leadKey)}
            <ArrowRight className="size-[18px] rtl:-scale-x-100" />
          </Link>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {item.groups.map((group) => (
              <div key={group.headingKey} className="w-[196px]">
                <span className="font-heading mb-2 block text-xs font-bold tracking-[0.08em] text-[color:var(--text-3)] uppercase">
                  {t(group.headingKey)}
                </span>
                <ul className="flex flex-col gap-0.5">
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.labelKey}>
                        <Link
                          href={link.href}
                          onClick={onNavigate}
                          className="group/link flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface-2)] text-foreground transition-colors group-hover/link:border-primary/40 group-hover/link:text-primary">
                            <Icon className="size-[18px]" />
                          </span>
                          <span className="text-[15px] font-medium text-foreground">
                            {t(link.labelKey)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {item.side ? (
          <Link
            href={item.side.href}
            onClick={onNavigate}
            className="relative hidden w-[248px] shrink-0 flex-col gap-2.5 overflow-hidden rounded-[20px] border border-[color:var(--hairline)] p-6 transition-colors hover:border-primary/40 lg:flex [background:linear-gradient(155deg,color-mix(in_srgb,hsl(var(--grad-from))_22%,var(--surface-2)),var(--surface-2)_70%)]"
          >
            <span className="font-mono text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">
              {t(item.side.kickKey)}
            </span>
            <span className="text-lg font-bold tracking-tight">
              {t(item.side.titleKey)}
            </span>
            <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">
              {t(item.side.descKey)}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              {t("nav.learnMore")}
              <ArrowRight className="size-[15px] rtl:-scale-x-100" />
            </span>
          </Link>
        ) : null}
       </div>
      </div>
    </div>
  );
}
