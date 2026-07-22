"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, SplitText, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type PricingProps = Record<string, never>;

type Tier = {
  kicker: string;
  name: string;
  blurb: string;
  price: { monthly: string; annual: string };
  unit?: string;
  fee: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    kicker: "— Starter",
    name: "Explorer",
    blurb: "For individuals dipping into on-chain investing.",
    price: { monthly: "$0", annual: "$0" },
    unit: "/ mo",
    fee: "Performance fee · 1% of profits only",
    features: [
      "Up to $50k assets",
      "3 managed portfolios",
      "Access to 14 chains",
      "Standard email support",
    ],
    cta: "Start free",
  },
  {
    kicker: "— Growth",
    name: "Compounder",
    blurb: "For serious investors compounding six figures.",
    price: { monthly: "$36", annual: "$29" },
    unit: "/ mo · billed annually",
    fee: "Performance fee · 0.5% of profits only",
    features: [
      "Up to $1M assets",
      "Unlimited custom baskets",
      "Real-yield staking · auto-compound",
      "Tax-loss harvesting",
      "Priority chat + email",
    ],
    cta: "Start compounding",
    featured: true,
  },
  {
    kicker: "— Institutional",
    name: "Desk",
    blurb: "For funds and treasuries deploying nine figures.",
    price: { monthly: "Custom", annual: "Custom" },
    fee: "Negotiated · flat basis-point fee",
    features: [
      "Unlimited AUM",
      "Dedicated MPC vaults",
      "Custom compliance workflows",
      "Named account manager",
      "24/7 desk · 15-min SLA",
    ],
    cta: "Talk to sales",
  },
];

export function Pricing({}: PricingProps) {
  const root = useRef<HTMLElement>(null);
  const [annual, setAnnual] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const title = el.querySelector<HTMLElement>("[data-title]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      if (prefersReducedMotion()) {
        gsap.set([...items, ...cards.flatMap((c) => Array.from(c.querySelectorAll<HTMLElement>("[data-card-el]")))], { opacity: 1, y: 0 });
        return;
      }

      // Each pricing card reveals its inner blocks one-by-one; cards cascade.
      cards.forEach((card, i) => {
        const els = card.querySelectorAll<HTMLElement>("[data-card-el]");
        if (!els.length) return;
        gsap.from(els, {
          opacity: 0,
          y: 24,
          duration: 0.55,
          ease: REVEAL_EASE,
          stagger: 0.1,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            toggleActions: "restart none none reset",
          },
        });
      });

      // Title reveals line-by-line, each wiping up from behind a mask.
      if (title) {
        const split = new SplitText(title, {
          type: "lines",
          mask: "lines",
          linesClass: "will-change-transform",
        });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 0.9,
          delay: 0.15,
          ease: "power4.out",
          stagger: 0.16,
          scrollTrigger: {
            trigger: title,
            start: "top 82%",
            toggleActions: "restart none none reset",
          },
        });
      }

      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          ease: REVEAL_EASE,
          stagger: 0.09,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
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
      id="pricing"
      className="mx-auto w-full max-w-[var(--maxw)] px-7 py-[clamp(80px,12vw,140px)]"
    >
      {/* Header */}
      <div className="mb-14 flex flex-col items-center text-center">
        <div
          data-reveal
          className="mb-4 flex items-center gap-3 font-mono text-[12.5px] font-semibold tracking-[0.12em] text-primary uppercase"
        >
          Pricing
        </div>
        <h2
          data-title
          className="overflow-hidden pb-[0.12em] font-hero text-[clamp(36px,5vw,68px)] leading-[1.03] font-bold tracking-tight text-balance text-foreground"
        >
          Fair fees. <span className="text-primary italic">Zero</span> surprises.
        </h2>
        <p data-reveal className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-muted-foreground">
          Transparent, on-chain, verifiable. Pay only when you profit — never on
          your principal.
        </p>

        {/* Toggle */}
        <div className="mt-8 inline-flex rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-2)] dark:border-white/8 dark:bg-white/4 p-1.5">
          <button
            type="button"
            onClick={() => setAnnual(false)}
            className={`rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${
              !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            className={`rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors ${
              annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Annual · save 20%
          </button>
        </div>
      </div>

      {/* Tiers */}
      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            data-card
            className={`relative flex flex-col gap-6 overflow-hidden rounded-3xl border p-9 transition-[transform,border-color] duration-400 hover:-translate-y-1.5 ${
              t.featured
                ? "border-primary/30 bg-linear-160 from-primary/16 to-primary/2 lg:-translate-y-3 lg:hover:-translate-y-4.5"
                : "border-[color:var(--hairline)] bg-[color:var(--surface)] dark:border-white/8 dark:bg-linear-to-b dark:from-white/4 dark:to-white/1 hover:border-primary/30"
            }`}
          >
            {t.featured && (
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute -end-14 -top-14 size-52 animate-pulse rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.3),transparent_70%)] blur-2xl"
                />
                <span className="absolute end-5 top-5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-primary-foreground uppercase">
                  Most popular
                </span>
              </>
            )}

            <div data-card-el className="relative">
              <div className="font-hero text-[14px] tracking-[0.06em] text-muted-foreground/70 uppercase italic">
                {t.kicker}
              </div>
              <h3 className="mt-3 mb-2 font-hero text-[32px] font-bold text-foreground">
                {t.name}
              </h3>
              <p className="text-[14px] text-muted-foreground">{t.blurb}</p>
            </div>

            <div data-card-el className="relative flex items-baseline gap-1">
              <span className="font-hero text-[clamp(48px,6vw,64px)] leading-none text-foreground">
                {annual ? t.price.annual : t.price.monthly}
              </span>
              {t.unit && (
                <span className="ms-2 text-[15px] text-muted-foreground/70">
                  {t.unit}
                </span>
              )}
            </div>

            <div
              data-card-el
              className={`relative rounded-lg border px-3 py-2 text-[12px] tracking-[0.04em] uppercase ${
                t.featured
                  ? "border-primary/20 bg-[color:var(--surface-2)] text-primary/90"
                  : "border-[color:var(--hairline)] bg-[color:var(--surface-2)] text-muted-foreground/70 dark:border-white/6 dark:bg-white/3"
              }`}
            >
              {t.fee}
            </div>

            <div data-card-el className="relative h-px bg-[color:var(--hairline)] dark:bg-white/8" />

            <div data-card-el className="relative flex flex-col gap-3.5">
              {t.features.map((f) => (
                <div key={f} className="flex items-start gap-3 text-[14px] leading-snug text-muted-foreground">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/15">
                    <Check className="size-3 text-primary" strokeWidth={3} />
                  </span>
                  {f}
                </div>
              ))}
            </div>

            <Link
              href="/register"
              data-card-el
              className={`relative mt-auto flex items-center justify-center rounded-full px-5 py-3.5 text-[14px] font-semibold transition-opacity hover:opacity-90 ${
                t.featured
                  ? "bg-(image:--gradient) text-primary-foreground"
                  : "border border-(--hairline-strong) bg-foreground/5 text-foreground"
              }`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Fine print */}
      <p data-reveal className="mt-10 text-center text-[13px] text-muted-foreground/70">
        No hidden custody fees · No spread markups · Cancel anytime ·{" "}
        <Link href="/register" className="text-primary">
          Full fee schedule →
        </Link>
      </p>
    </section>
  );
}
