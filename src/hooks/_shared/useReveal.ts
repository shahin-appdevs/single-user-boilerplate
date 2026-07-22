"use client";

import { useEffect, useRef, useState } from "react";

export type UseRevealOptions = {
  /** Fraction of the element visible before it counts as revealed. */
  threshold?: number;
  /** Reveal only once, then stop observing. */
  once?: boolean;
};

/**
 * IntersectionObserver-backed reveal-on-scroll.
 * Returns a ref to attach and a boolean to drive `data-revealed`.
 * Respects `prefers-reduced-motion` by revealing immediately.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  once = true,
}: UseRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, revealed } as const;
}
