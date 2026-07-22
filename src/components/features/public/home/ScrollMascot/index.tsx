"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

export type ScrollMascotProps = Record<string, never>;

// Vertical travel: from near the top of the viewport down to near the bottom
// as the page scrolls from start to end.
const TOP_VH = 0.08;
const BOTTOM_VH = 0.82;

// Gentle per-section liveliness while it stays on the left: a small sway and
// tilt, one cycle per section. Never crosses the page.
const SECTIONS = 6;
const SWAY_PX = 18;
const TILT_DEG = 7;

/**
 * Left-rail guide mascot. Portaled to <body> (outside ScrollSmoother's
 * transformed #smooth-content, which would break position:fixed) so it stays
 * pinned to the viewport. It always hugs the left gutter; scroll progress
 * scrubs its smooth descent (top → bottom) with a small sway + tilt per section
 * for life, plus a lazy bob. Desktop only; hidden for touch / reduced motion.
 */
export function ScrollMascot({}: ScrollMascotProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // useLayoutEffect: cleanup must run synchronously before React removes
  // this on route change, or ctx.revert() runs too late relative to the
  // portal's own removal, in the same class of bug as the pinned sections.
  useLayoutEffect(() => {
    const el = outer.current;
    const bob = inner.current;
    if (!mounted || !el || !bob) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(max-width: 1023px)").matches) return;

    const ctx = gsap.context(() => {
      // Drop-in on load.
      gsap.from(el, {
        autoAlpha: 0,
        scale: 0.6,
        rotation: -14,
        transformOrigin: "center",
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.15,
      });

      // Lazy bob on the inner node so it never fights the scrubbed descent.
      gsap.to(bob, {
        y: 14,
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Scroll-scrubbed descent down the left rail, with a small sway/tilt.
      const st = ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const h = window.innerHeight;
          const wave = Math.sin(p * Math.PI * SECTIONS);
          const y = h * (TOP_VH + p * (BOTTOM_VH - TOP_VH)); // descend
          const x = wave * SWAY_PX; // stay left, tiny sway
          const rot = wave * TILT_DEG; // tilt with the sway
          gsap.to(el, {
            x,
            y,
            rotation: rot,
            duration: 0.5,
            ease: "sine.out",
            overwrite: "auto",
          });
        },
      });

      ScrollTrigger.refresh();

      return () => st.kill();
    });

    return () => ctx.revert();
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={outer}
      aria-hidden
      className="pointer-events-none fixed top-0 start-[clamp(12px,3vw,56px)] z-[60] hidden w-[clamp(72px,7vw,120px)] lg:block"
    >
      <div ref={inner}>
        <Image
          src="/images/pertials/robot.webp"
          alt=""
          width={500}
          height={500}
          priority
          className="h-auto w-full select-none drop-shadow-[0_16px_34px_hsl(var(--primary)/0.4)]"
        />
      </div>
    </div>,
    document.body,
  );
}
