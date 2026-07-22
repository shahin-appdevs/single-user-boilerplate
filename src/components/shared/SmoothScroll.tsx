"use client";

import { useEffect, useState } from "react";

import { ScrollSmoother, prefersReducedMotion } from "@/lib/gsap";

export type SmoothScrollProps = Record<string, never>;

/**
 * GSAP ScrollSmoother for public pages. Desktop (lg+) with a fine pointer only —
 * touch devices and reduced-motion users get native scroll. Wraps the
 * `#smooth-wrapper > #smooth-content` pair rendered by the public layout;
 * ScrollTrigger-pinned sections (the home hero) integrate automatically.
 */
export function SmoothScroll({}: SmoothScrollProps) {
  // Enable only from the `lg` breakpoint up (1024px); re-evaluate on resize.
  const [lgUp, setLgUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setLgUp(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!lgUp) return;
    // Hybrid laptops report `(pointer: coarse)`, so gate on hover instead.
    if (window.matchMedia("(hover: none)").matches) return;
    if (prefersReducedMotion()) return;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2, // seconds to catch up — soft trail, mirrors the old Lenis lerp
      smoothTouch: false,
      effects: false,
    });

    return () => {
      smoother.kill();
    };
  }, [lgUp]);

  return null;
}
