"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { gsap, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type FooterRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Staggers every [data-foot] descendant into view when the footer scrolls in.
 * Uses IntersectionObserver (not ScrollTrigger) so pinned sections inflating
 * the document height can't push the trigger past max-scroll and leave the
 * footer stuck hidden.
 */
export function FooterReveal({ children, className }: FooterRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = gsap.utils.toArray<HTMLElement>("[data-foot]", el);
    if (!targets.length) return;

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 24 });
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: REVEAL_EASE,
            stagger: 0.08,
          });
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
