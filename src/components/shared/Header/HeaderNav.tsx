"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { NAV } from "./nav.config";
import { MegaMenu } from "./MegaMenu";

export type HeaderNavProps = {
  className?: string;
};

export function HeaderNav({ className }: HeaderNavProps) {
  const t = useTranslations("home") as (key: string) => string;
  const [open, setOpen] = useState<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={() => setOpen(null)}
    >
      {NAV.map((item, i) => {
        const label = (
          <span className="inline-flex items-center gap-1.5">
            {t(item.labelKey)}
            {item.kind === "mega" ? (
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-300 ease-out",
                  open === i && "-rotate-180 text-primary",
                )}
              />
            ) : null}
          </span>
        );

        const triggerClass =
          "rounded-md px-3.5 py-2.5 text-[15px] font-semibold text-foreground/80 transition-colors hover:text-foreground aria-expanded:text-foreground dark:text-white/85 dark:hover:text-white";

        if (item.kind === "link") {
          return (
            <Link key={item.labelKey} href={item.href} className={triggerClass}>
              {label}
            </Link>
          );
        }

        return (
          <div
            key={item.labelKey}
            className="static"
            onMouseEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
          >
            <button
              type="button"
              className={triggerClass}
              aria-expanded={open === i}
              aria-haspopup="true"
              onClick={() => setOpen((cur) => (cur === i ? null : i))}
            >
              {label}
            </button>
            {open === i ? (
              <MegaMenu item={item} onNavigate={() => setOpen(null)} />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
