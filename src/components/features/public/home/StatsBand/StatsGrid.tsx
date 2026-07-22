"use client";

import { useEffect, useRef } from "react";

import { gsap, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";
import { CountUp } from "./CountUp";

export type StatItem = {
  key: string;
  to: number;
  decimals?: number;
  suffix?: string;
  label: string;
};

/** Stats grid that reveals its cells one-by-one on scroll into view; each
 * number then counts up (see CountUp). A surface fill sweeps bottom → top. */
export function StatsGrid({ items }: { items: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fill = el.querySelector<HTMLElement>("[data-fill]");
    const cells = el.querySelectorAll<HTMLElement>("[data-cell]");

    if (prefersReducedMotion()) {
      if (fill) gsap.set(fill, { height: "100%" });
      gsap.set(cells, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 60%", once: true },
      });
      if (fill) {
        tl.from(fill, { height: "0%", duration: 1, ease: REVEAL_EASE }, 0);
      }
      tl.from(
        cells,
        {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: REVEAL_EASE,
          stagger: 0.15,
        },
        0.05,
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="card-shadow relative grid grid-cols-2 gap-4 overflow-hidden rounded-3xl border border-[color:var(--hairline)] px-7 py-9 text-center sm:grid-cols-4"
    >
      {/* Surface fill: starts empty, sweeps bottom → top on scroll into view. */}
      <span
        aria-hidden
        data-fill
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-full bg-[color:var(--surface)] [backdrop-filter:blur(22px)_saturate(150%)]"
      />
      {items.map((s) => (
        <div
          key={s.key}
          data-cell
          className="relative z-[1] flex flex-col gap-2 not-last:after:absolute not-last:after:end-[-8px] not-last:after:top-[12%] not-last:after:h-[76%] not-last:after:w-px not-last:after:bg-[color:var(--hairline)] max-sm:[&:nth-child(2)]:after:hidden"
        >
          <span className="font-heading bg-[image:var(--gradient)] bg-clip-text text-[clamp(34px,4.4vw,52px)] font-bold tracking-tight text-transparent">
            <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
          </span>
          <span className="mx-auto max-w-[22ch] text-sm text-muted-foreground">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
