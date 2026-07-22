"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useScrolled } from "@/hooks/_shared/useScrolled";

export type HeaderBarProps = {
  children: ReactNode;
};

/** Fixed top bar: transparent at the top, blurred + bordered once scrolled. */
export function HeaderBar({ children }: HeaderBarProps) {
  const scrolled = useScrolled(8);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-[var(--nav-h,72px)] items-center transition-colors duration-300",
      )}
    >
      {/* blur layer kept off <header> so it isn't a backdrop-filter root for the
          mega menu — otherwise the menu's glass blur loses the page behind it. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-1 transition-opacity duration-300",
          scrolled
            ? "bg-background/80 opacity-100 backdrop-blur-md backdrop-saturate-150"
            : "opacity-0",
        )}
      />
      {children}
    </header>
  );
}
