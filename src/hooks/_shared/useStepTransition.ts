"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Enter animation for a keyed step container (multi-step forms). Replays a
 * short fade + horizontal slide whenever `step` changes; reduced motion drops
 * the slide. Attach the returned ref to a `key={step}` element.
 */
export function useStepTransition<T extends HTMLElement = HTMLDivElement>(
  step: number | string,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x: prefersReducedMotion() ? 0 : 8 },
        { opacity: 1, x: 0, duration: 0.2, ease: "power2.out" },
      );
    }, el);

    return () => ctx.revert();
  }, [step]);

  return ref;
}
