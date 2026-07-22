"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";

import { gsap, ScrollTrigger, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type NewsletterProps = Record<string, never>;

const ISSUES = [
  { title: "Vaults 2.0 · Solana & Sui go live", meta: "Issue #048 · Jul 18" },
  { title: "Why we cut fees to 0.5%", meta: "Issue #047 · Jul 11" },
];

export function Newsletter({}: NewsletterProps) {
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
          stagger: 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top 82%",
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
      className="mx-auto mt-24 w-full max-w-[var(--maxw)] px-7"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-primary/20 bg-linear-160 from-primary/10 to-white/2 px-8 py-16 sm:px-14 sm:py-20">
        {/* Radial washes */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_300px_at_90%_10%,hsl(var(--primary)/0.2),transparent_60%),radial-gradient(400px_300px_at_10%_90%,hsl(var(--primary)/0.14),transparent_60%)]"
        />
        {/* Grid overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(hsl(var(--primary)/0.06)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.06)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(600px_400px_at_50%_50%,#000,transparent_80%)]"
        />
        {/* Orbit ring */}
        <span
          aria-hidden
          className="pointer-events-none absolute -end-20 -top-20 size-60 animate-[spin_30s_linear_infinite] rounded-full border border-dashed border-primary/30"
        >
          <span className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
        </span>

        <div className="relative grid items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          {/* Left */}
          <div data-reveal>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-[12px] tracking-[0.08em] text-primary/90 uppercase">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              Newsletter · weekly
            </div>
            <h2 className="font-hero text-[clamp(30px,4vw,52px)] leading-[1.05] font-bold tracking-tight text-balance text-foreground">
              Stay <span className="text-primary italic">connected</span> with us
              for regular updates.
            </h2>
            <p className="mt-5 max-w-[480px] text-[17px] leading-relaxed text-muted-foreground">
              Market recaps, on-chain research, and product releases — delivered
              every Thursday. No spam, unsubscribe anytime.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-[13px] text-muted-foreground/70">
              <span className="flex items-center gap-2">
                <Check className="size-3.5 text-primary" strokeWidth={2.5} />
                <span>
                  <strong className="text-foreground">42,000+</strong> readers
                </span>
              </span>
              <span className="hidden h-3.5 w-px bg-white/10 sm:block" />
              <span className="flex items-center gap-2">
                <Check className="size-3.5 text-primary" strokeWidth={2.5} />
                <span>
                  Zero spam · <strong className="text-foreground">GDPR</strong>
                </span>
              </span>
            </div>
          </div>

          {/* Right — form */}
          <form
            data-reveal
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 py-2 ps-5 pe-2 backdrop-blur transition-[border-color,box-shadow] focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]">
              <Mail className="size-4.5 shrink-0 text-muted-foreground/70" />
              <input
                type="email"
                required
                placeholder="you@wallet.com"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-[16px] text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-(image:--gradient) px-5 py-3 text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Subscribe
                <ArrowRight className="size-4 rtl:-scale-x-100" />
              </button>
            </div>

            <div className="ps-5 text-[12px] text-muted-foreground/70">
              By subscribing you agree to our{" "}
              <a href="#" className="text-primary/90">
                privacy policy
              </a>
              .
            </div>

            {/* Recent issues */}
            <div className="mt-3 grid gap-2.5">
              <div className="mb-1 text-[11px] tracking-[0.08em] text-muted-foreground/70 uppercase">
                Recent issues
              </div>
              {ISSUES.map((it) => (
                <a
                  key={it.title}
                  href="#"
                  className="flex items-center justify-between gap-4 rounded-xl border border-primary/12 bg-primary/8 px-4 py-3 transition-colors hover:border-primary/25"
                >
                  <div>
                    <div className="font-hero text-[14px] font-semibold text-foreground/90">
                      {it.title}
                    </div>
                    <div className="mt-0.5 text-[12px] text-muted-foreground/70">
                      {it.meta}
                    </div>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-primary rtl:-scale-x-100" />
                </a>
              ))}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
