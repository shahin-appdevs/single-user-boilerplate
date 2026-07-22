"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type AboutContentProps = Record<string, never>;

const STATS = [
  { value: "2021", label: "Founded", accent: false },
  { value: "148k", label: "Investors", accent: true },
  { value: "62", label: "Countries", accent: false },
  { value: "0", label: "Breaches", accent: false },
];

type Event = {
  year: string;
  tag: string;
  title: string;
  desc: string;
  now?: boolean;
};

const TIMELINE: Event[] = [
  {
    year: "2021",
    tag: "The beginning",
    title: "Founded in Brooklyn",
    desc: "Two engineers, one thesis: serious capital deserves a calm, verifiable home on-chain.",
  },
  {
    year: "2022",
    tag: "Series A",
    title: "$12M led by Bergnaum Capital",
    desc: "Institutional backing to build custody and risk infrastructure the right way.",
  },
  {
    year: "2023",
    tag: "Trust",
    title: "SOC 2 Type II · $400M AUM",
    desc: "Independent audits, quarterly proof-of-reserves, and our first $400M under management.",
  },
  {
    year: "2024",
    tag: "Scale",
    title: "14-chain expansion · team of 84",
    desc: "Multi-chain vaults, three offices, and a desk that never sleeps.",
  },
  {
    year: "Today",
    tag: "Now",
    title: "$2.4B AUM · 148k investors",
    desc: "148,000 investors across 62 countries — still zero breaches since day one.",
    now: true,
  },
];

/** Decorative dot-shape accent — texture recolored to primary via alpha mask,
    centered on a card's bottom-end corner. */
function DotAccent() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute end-0 bottom-0 aspect-square w-[130%] max-w-[760px] translate-x-1/2 translate-y-1/2 bg-primary opacity-25 [mask-image:url(/images/pertials/dot-shap.png)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] rtl:-translate-x-1/2"
    />
  );
}

export function AboutContent({}: AboutContentProps) {
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
          y: 26,
          duration: 0.7,
          ease: REVEAL_EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      }
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={root}>
      {/* HERO */}
      <section className="mx-auto w-full max-w-[var(--maxw)] px-7 pt-[clamp(90px,13vw,140px)] pb-10">
        <div className="mb-14 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div data-reveal>
            <div className="mb-6 flex items-center gap-3 font-mono text-[12.5px] font-semibold tracking-[0.14em] text-primary uppercase">
              About us
              <span className="font-hero text-[14px] tracking-[0.06em] text-foreground normal-case">
                EST. MMXXI
              </span>
            </div>
            <h1 className="font-hero text-[clamp(52px,9vw,96px)] leading-[1] font-bold tracking-tight text-foreground">
              Builders,
              <br />
              not <span className="text-primary italic">brokers</span>.
            </h1>
            <p className="mt-8 max-w-[620px] text-[clamp(17px,2vw,20px)] leading-relaxed text-muted-foreground">
              CrypInvest was founded in 2021 by a small team of traders,
              cryptographers, and risk engineers — the platform we always wished
              existed for serious on-chain capital.
            </p>
          </div>
          <div data-reveal className="text-start lg:text-end">
            <div className="font-hero text-[clamp(56px,8vw,88px)] leading-none text-primary italic">
              $2.4B
            </div>
            <div className="mt-1.5 text-[13px] tracking-[0.06em] text-muted-foreground/70 uppercase">
              Assets on platform
            </div>
          </div>
        </div>

        {/* Team image */}
        <div
          data-reveal
          className="relative grid h-[clamp(320px,45vw,520px)] place-items-center overflow-hidden rounded-[28px] border border-primary/24 bg-linear-160 from-primary/16 to-primary/2"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -end-16 -top-16 size-64 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.3),transparent_70%)] blur-2xl"
          />
          <DotAccent />
          <Image
            src="/images/pertials/network-map.webp"
            alt=""
            width={840}
            height={840}
            className="relative h-auto w-[min(70%,560px)] select-none object-contain"
          />
          <div className="absolute bottom-6 start-6 flex items-center gap-3.5 rounded-2xl border border-primary/30 bg-linear-160 from-primary/20 to-primary/5 px-5 py-3.5 backdrop-blur">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            <div>
              <div className="font-hero text-[16px] text-foreground">
                The team · NYC / London / Singapore
              </div>
              <div className="mt-0.5 text-[12px] text-primary/80">
                84 people, three continents, one thesis.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="mx-auto w-full max-w-[var(--maxw)] px-7 py-14">
        <div
          data-reveal
          className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-primary/24 bg-primary/20 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-linear-160 from-primary/16 to-primary/2 p-8">
              <div
                className={`font-hero text-[clamp(34px,4vw,44px)] leading-none ${s.accent ? "text-primary" : "text-foreground"}`}
              >
                {s.value}
              </div>
              <div className="mt-2 text-[12px] tracking-[0.06em] text-muted-foreground/70 uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mx-auto w-full max-w-[var(--maxw)] px-7 py-[clamp(60px,9vw,100px)]">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mission */}
          <div
            data-reveal
            className="relative overflow-hidden rounded-[28px] border border-primary/24 bg-linear-160 from-primary/16 to-primary/2 p-10"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -end-14 -top-14 size-56 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.3),transparent_70%)] blur-2xl"
            />
            <DotAccent />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <span className="font-hero text-[14px] text-primary italic">— I.</span>
                <span className="text-[12px] tracking-[0.12em] text-primary/90 uppercase">
                  Our Mission
                </span>
              </div>
              <h2 className="mb-5 font-hero text-[clamp(30px,4vw,48px)] leading-[1.05] font-bold tracking-tight text-foreground">
                Make on-chain investing feel{" "}
                <span className="text-primary italic">boring</span>.
              </h2>
              <p className="text-[17px] leading-relaxed text-[#b7d4cb]">
                We exist to give serious capital a calm, predictable home on
                public blockchains — with the rigor of a Goldman desk and the
                transparency of an open ledger. No hype, no token games, no
                extraction. Just compounding that shows up every day.
              </p>
              <div className="mt-8 flex items-center gap-3 text-[13px] text-primary/90">
                <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
                <span>
                  Serve <strong className="text-foreground">every investor</strong>,
                  from $10 to $100M, with the same rigor.
                </span>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div
            data-reveal
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-b from-white/4 to-white/1 p-10"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute end-10 top-10 size-20 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-primary/35"
            >
              <span className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-primary" />
            </span>
            <DotAccent />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <span className="font-hero text-[14px] text-primary italic">— II.</span>
                <span className="text-[12px] tracking-[0.12em] text-primary uppercase">
                  Our Vision
                </span>
              </div>
              <h2 className="mb-5 font-hero text-[clamp(30px,4vw,48px)] leading-[1.05] font-bold tracking-tight text-foreground">
                A world where <span className="text-primary italic">every</span>{" "}
                wallet is a portfolio.
              </h2>
              <p className="text-[17px] leading-relaxed text-muted-foreground">
                By 2030, on-chain assets will hold a meaningful share of global
                household savings. We&apos;re building the operating system that
                makes that shift feel obvious, safe, and inevitable — for the
                next billion investors.
              </p>
              <div className="mt-8 flex items-center gap-3 text-[13px] text-muted-foreground">
                <Check className="size-4 shrink-0 text-primary" strokeWidth={2.5} />
                <span>
                  Ship a platform that{" "}
                  <strong className="text-foreground">outlasts</strong> the
                  founders.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STORY / TIMELINE */}
      <section className="mx-auto w-full max-w-[var(--maxw)] px-7 py-[clamp(60px,9vw,100px)]">
        <div className="grid gap-14 lg:grid-cols-[380px_1fr] lg:gap-20">
          <div data-reveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-4 font-mono text-[12.5px] font-semibold tracking-[0.12em] text-primary uppercase">
              Our story
            </div>
            <h2 className="mb-5 font-hero text-[clamp(30px,3.6vw,44px)] leading-[1.05] font-bold tracking-tight text-foreground">
              Five years. One <span className="text-primary italic">thesis</span>.
            </h2>
            <p className="text-[16px] leading-relaxed text-muted-foreground">
              From a two-person Brooklyn apartment to an 84-person desk across
              three continents — a chronological log.
            </p>
            <div className="mt-8 h-56 overflow-hidden rounded-[18px] border border-white/8">
              <video
                src="/videos/crypto.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div data-reveal className="relative">
            <span
              aria-hidden
              className="absolute inset-y-3 start-5 w-px bg-linear-to-b from-primary/40 to-primary/10"
            />
            {TIMELINE.map((ev) => (
              <div key={ev.year} className="relative py-5 ps-16 last:pb-0">
                <span
                  className={`absolute start-3 top-6 size-4.5 rounded-full border-[3px] border-background ${
                    ev.now
                      ? "bg-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.4)]"
                      : "bg-primary/50 shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]"
                  }`}
                />
                <div className="mb-2 flex items-baseline gap-4">
                  <span
                    className={`font-hero text-[28px] leading-none italic ${ev.now ? "text-primary" : "text-foreground"}`}
                  >
                    {ev.year}
                  </span>
                  <span className="text-[12px] tracking-[0.08em] text-muted-foreground/70 uppercase">
                    {ev.tag}
                  </span>
                </div>
                <h4 className="mb-1.5 font-hero text-[22px] text-foreground">
                  {ev.title}
                </h4>
                <p className="max-w-[640px] text-[15px] leading-relaxed text-muted-foreground">
                  {ev.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mb-24 w-full max-w-[1120px] px-7">
        <div className="relative flex flex-wrap items-center justify-between gap-10 overflow-hidden rounded-[32px] border border-primary/25 bg-linear-135 from-primary/10 to-white/2 p-8 sm:p-14 lg:px-14 lg:py-18">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_300px_at_100%_0%,hsl(var(--primary)/0.25),transparent_60%)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -end-20 -bottom-28 size-[380px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.35),transparent_70%)] blur-2xl"
          />
          <div data-reveal className="relative max-w-[620px]">
            <h2 className="font-hero text-[clamp(30px,4vw,44px)] leading-[1.05] font-bold tracking-tight text-foreground">
              Work with us, or invest with us.
            </h2>
            <p className="mt-4 text-[16px] text-muted-foreground">
              We&apos;re hiring across engineering, research, and compliance. Or
              open an account in under 3 minutes.
            </p>
          </div>
          <div data-reveal className="relative flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-(image:--gradient) px-6 py-4 text-[16px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              See open roles
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-(--hairline-strong) bg-foreground/5 px-6 py-4 text-[16px] font-medium text-foreground transition-colors hover:bg-foreground/10"
            >
              Start investing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
