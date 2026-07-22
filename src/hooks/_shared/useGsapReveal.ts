"use client";

import { useEffect, useRef, type RefObject } from "react";

import { gsap, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type GsapRevealOptions = {
  /** Initial vertical offset in px. */
  y?: number;
  /** Initial horizontal offset in px. */
  x?: number;
  /** Delay before the tween starts (s). */
  delay?: number;
  /** Tween duration (s). */
  duration?: number;
  /** Stagger the element's *direct children* one-by-one instead of the element. */
  stagger?: number;
  /** Fraction of the element visible before firing (old framer `viewport.amount`). */
  amount?: number;
  /** Replay on every scroll into view (resets when scrolled back out) instead of once. */
  repeat?: boolean;
};

/**
 * Fade + lift an element (or its direct children) into view on scroll, once,
 * via GSAP ScrollTrigger. `from` renders the hidden state immediately so there's
 * no first-frame flash. Snaps to the visible state under reduced-motion.
 */
export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  opts: GsapRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const {
    y = 20,
    x = 0,
    delay = 0,
    duration = 0.55,
    stagger,
    amount = 0.3,
    repeat = false,
  } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger != null ? Array.from(el.children) : el;

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, x: 0, y: 0, filter: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y,
        x,
        filter: "blur(8px)",
        duration,
        delay,
        ease: REVEAL_EASE,
        stagger: stagger ?? 0,
        scrollTrigger: {
          trigger: el,
          // "top 70%" ≈ 30% of the element in view (framer viewport.amount 0.3).
          start: `top ${Math.round((1 - amount) * 100)}%`,
          // Replay each time it re-enters view; reset to hidden when scrolled back out.
          ...(repeat
            ? { toggleActions: "restart none none reset" }
            : { once: true }),
        },
      });
    }, el);

    return () => ctx.revert();
  }, [y, x, delay, duration, stagger, amount, repeat]);

  return ref;
}
