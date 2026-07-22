"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type CtaPanelProps = Record<string, never>;

export function CtaPanel({}: CtaPanelProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: REVEAL_EASE,
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "restart none none reset",
          },
        });
      }
      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="mx-auto mt-16 w-full max-w-[1120px] px-7 py-[clamp(40px,7vw,80px)]"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-primary/20 bg-linear-135 from-primary/10 to-white/2 p-8 sm:p-14 lg:px-14 lg:py-18">
        {/* Top-corner radial wash */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_100%_0%,hsl(var(--primary)/0.25),transparent_60%)]"
        />
        {/* Bottom-end glow orb */}
        <span
          aria-hidden
          className="pointer-events-none absolute -end-20 -bottom-28 size-[380px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.35),transparent_70%)] blur-2xl"
        />

        <div className="relative flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div data-reveal className="max-w-[560px]">
            <h2 className="font-hero text-[clamp(32px,4.6vw,52px)] leading-[1.05] font-bold tracking-tight text-balance text-foreground">
              Ready to put your capital to work?
            </h2>
            <p className="mt-4 text-[17px] text-muted-foreground">
              Open an account in under 3 minutes. No minimums. Withdraw any time.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-full bg-(image:--gradient) px-6 py-4 text-[16px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start investing
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-(--hairline-strong) bg-foreground/5 px-6 py-4 text-[16px] font-medium text-foreground transition-colors hover:bg-foreground/10"
              >
                Talk to sales
              </Link>
            </div>
          </div>

          <div
            data-reveal
            className="w-full max-w-[340px] shrink-0 self-center lg:w-[42%]"
          >
            <Image
              src="/images/pertials/network-map.webp"
              alt=""
              width={840}
              height={840}
              className="h-auto w-full select-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
