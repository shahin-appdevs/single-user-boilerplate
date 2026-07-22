"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

// Register plugins once, client-side only (static export → no server runtime).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
}

/** Shared reveal easing (matches the old framer cubic-bezier [0.16,1,0.3,1]). */
export const REVEAL_EASE = "power3.out";

/** True when the user asked for reduced motion — reveals snap to their end state. */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
