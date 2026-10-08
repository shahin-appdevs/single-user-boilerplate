"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  REVEAL_EASE,
  prefersReducedMotion,
} from "@/lib/gsap";

export type TrustedInvestorsProps = Record<string, never>;

// Two staggered rows. Row 2 is offset so the same logo never sits directly
// under itself. Each list is duplicated in the markup for a seamless loop.
const ROW_1 = Array.from({ length: 12 }, (_, i) => `brand-${(i % 9) + 1}`);
const ROW_2 = Array.from({ length: 12 }, (_, i) => `brand-${((i + 4) % 9) + 1}`);

/**
 * Investor wall — eyebrow + heading over a two-line logo marquee. The header
 * rises on scroll-in; the two rows loop continuously in opposite directions
 * and speed up briefly while the page is being scrolled.
 */
export function TrustedInvestors({}: TrustedInvestorsProps) {
  const root = useRef<HTMLElement>(null);
  const rowA = useRef<HTMLUListElement>(null);
  const rowB = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      // Header reveal (scrubbed, reverses on scroll-up).
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 30%",
            scrub: 1.5,
          },
        })
        .from("[data-anim='sub']", {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          ease: REVEAL_EASE,
        })
        .from(
          "[data-anim='title']",
          { y: 32, autoAlpha: 0, duration: 0.7, ease: REVEAL_EASE },
          "-=0.35",
        );

      // Seamless marquee per row. Each track renders two identical halves;
      // travelling one half-width and looping is invisible. Row A follows text
      // direction, row B runs the opposite way.
      const rtl = getComputedStyle(el).direction === "rtl";
      const build = (trackEl: HTMLElement, reverse: boolean) => {
        const half = trackEl.scrollWidth / 2;
        const toLeft = reverse ? rtl : !rtl;
        return gsap.fromTo(
          trackEl,
          { x: toLeft ? 0 : -half },
          { x: toLeft ? -half : 0, duration: 48, ease: "none", repeat: -1 },
        );
      };

      const loops = [rowA.current, rowB.current]
        .filter((n): n is HTMLUListElement => !!n)
        .map((n, i) => build(n, i === 1));

      // Scroll-velocity boost: while scrolling, speed the loops up, then ease
      // back to 1×. Prefer ScrollSmoother's velocity (px/s) — under the smoother
      // the trigger's own getVelocity() reads the eased value and is too weak.
      let reset: ReturnType<typeof setTimeout>;
      const speedUp = (v: number) => {
        const boost = 1 + Math.min(Math.abs(v) / 700, 7);
        loops.forEach((l) =>
          gsap.to(l, { timeScale: boost, duration: 0.15, overwrite: true }),
        );
        clearTimeout(reset);
        reset = setTimeout(
          () => loops.forEach((l) => gsap.to(l, { timeScale: 1, duration: 0.6 })),
          140,
        );
      };
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) =>
          speedUp(ScrollSmoother.get()?.getVelocity() ?? self.getVelocity()),
      });

      ScrollTrigger.refresh();

      return () => {
        clearTimeout(reset);
        st.kill();
        loops.forEach((l) => l.kill());
      };
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative z-[1] py-[clamp(56px,9vh,110px)]">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center px-[clamp(20px,6vw,72px)] text-center">
        <p
          data-anim="sub"
          className="inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold tracking-[0.18em] text-primary uppercase rtl:tracking-[0.04em]"
        >
          Trusted by leading Web3 investors.
        </p>
        <h2
          data-anim="title"
          className="mt-5 max-w-[22ch] font-hero text-[clamp(36px,5vw,68px)] leading-[1.03] font-bold tracking-tight text-balance text-foreground"
        >
          The best investors trust{" "}
          <span className="text-primary">QRSim</span>
        </h2>
      </div>

      <div className="mt-12 flex flex-col gap-3 overflow-hidden mask-[linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        {[
          { data: ROW_1, ref: rowA },
          { data: ROW_2, ref: rowB },
        ].map((row, r) => (
          <ul
            key={r}
            ref={row.ref}
            className="flex w-max flex-nowrap gap-3 will-change-transform"
          >
            {[...row.data, ...row.data].map((brand, i) => (
              <li key={`${brand}-${i}`} className="w-47.5 shrink-0">
                <div className="flex h-24 items-center justify-center rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-2)] px-6 text-center transition-colors dark:border-0 dark:border-t dark:border-white/10 dark:bg-linear-to-b dark:from-white/6 dark:to-white/2 dark:shadow-[inset_0_1px_0_0_hsl(0_0%_100%/0.12)] dark:hover:from-white/10 hover:bg-[color:var(--hairline)]/10">
                  <Image
                    src={`/images/investors/${brand}.webp`}
                    alt=""
                    width={396}
                    height={102}
                    className="h-auto w-full max-w-[150px] object-contain opacity-75 transition-opacity hover:opacity-100 dark:invert-0 invert"
                  />
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
