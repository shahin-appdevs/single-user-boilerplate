"use client";

import { useEffect } from "react";

import { usePathname } from "@/i18n/navigation";

/**
 * Resets scroll to the top on every route change and disables the browser's
 * automatic scroll restoration so a reload also starts at (0, 0).
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
