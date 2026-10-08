"use client";

import { useEffect, useRef } from "react";

import { gsap, ScrollTrigger, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type TrustedByProps = Record<string, never>;

const STATS = [
  { value: "4.9", suffix: "/5", label: "Institutional NPS", accent: true },
  { value: "40+", suffix: "", label: "Funds onboarded", accent: false },
];

/**
 * Trusted-by header + featured testimonial. The logo marquee that follows in
 * the design is rendered by the adjacent <TrustedInvestors /> section.
 */
export function TrustedBy({}: TrustedByProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const titleLines = gsap.utils.toArray<HTMLElement>("[data-title-inner]");
      if (prefersReducedMotion()) {
        gsap.set([...items, ...titleLines], { opacity: 1, y: 0, yPercent: 0 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "restart none none reset",
        },
      });
      // Heading wipes up line-by-line behind its mask, like the hero title.
      if (titleLines.length) {
        tl.from(titleLines, {
          yPercent: 120,
          duration: 0.9,
          ease: REVEAL_EASE,
          stagger: 0.12,
        });
      }
      if (items.length) {
        tl.from(
          items,
          {
            opacity: 0,
            y: 26,
            duration: 0.7,
            ease: REVEAL_EASE,
            stagger: 0.1,
          },
          0.2,
        );
      }
      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="mx-auto w-full max-w-[var(--maxw)] px-7 pt-[clamp(70px,11vw,120px)]"
    >
      {/* Header */}
      <div className="mb-14 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <div
            data-reveal
            className="mb-4 font-mono text-[12.5px] font-semibold tracking-[0.12em] text-primary uppercase"
          >
            Trusted by
          </div>
          <h2 className="max-w-[820px] overflow-hidden pb-[0.12em] font-hero text-[clamp(36px,5vw,68px)] leading-[1.05] font-bold tracking-tight text-balance text-foreground">
            <span data-title-inner className="block">
              The desk behind <span className="text-primary italic">$2.4B</span>{" "}
              of on-chain capital.
            </span>
          </h2>
        </div>
        <p
          data-reveal
          className="max-w-[320px] text-[15px] leading-relaxed text-muted-foreground"
        >
          148,000 investors and 40+ funds route flow through QRSim every
          day.
        </p>
      </div>

      {/* Featured testimonial */}
      <div
        data-reveal
        className="relative overflow-hidden rounded-[28px] border border-primary/20 bg-linear-135 from-primary/10 to-white/[0.02] p-8 sm:p-14"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute start-10 top-4 font-hero text-[clamp(120px,16vw,180px)] leading-none text-primary/[0.14] italic"
        >
          &ldquo;
        </span>
        {/* Orbit ring — dashed circle with a glowing dot riding its edge. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -end-16 -top-16 size-48 animate-[spin_30s_linear_infinite] rounded-full border border-dashed border-primary/30"
        >
          <span className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
        </span>

        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_300px] lg:gap-14">
          <div>
            <blockquote className="font-hero text-[clamp(22px,2.6vw,30px)] leading-[1.35] font-semibold text-balance text-foreground italic">
              QRSim is the only platform where our risk team, our compliance
              team, and our traders all agree. It&apos;s how we deploy nine
              figures without losing sleep.
            </blockquote>

            <div className="mt-8 flex items-center gap-3.5">
              <span className="grid size-11 place-items-center rounded-full bg-linear-135 from-primary to-[#1F8A6A] font-bold text-[#061916]">
                EM
              </span>
              <div>
                <div className="font-semibold text-foreground">
                  Elena Morissette
                </div>
                <div className="text-[14px] text-muted-foreground">
                  Head of Digital Assets, Bergnaum Capital
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3.5">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-2)] p-5"
              >
                <div
                  className={`font-hero text-[32px] leading-none ${s.accent ? "text-primary" : "text-foreground"}`}
                >
                  {s.value}
                  {s.suffix && (
                    <span className="text-[18px] text-muted-foreground/70">
                      {s.suffix}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 text-[13px] tracking-[0.04em] text-muted-foreground/70 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
