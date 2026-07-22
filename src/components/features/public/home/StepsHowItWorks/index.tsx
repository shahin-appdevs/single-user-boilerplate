"use client";

import { useLayoutEffect, useRef } from "react";
import {
  BarChart3,
  Clock,
  ListChecks,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { gsap, ScrollTrigger, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type StepsHowItWorksProps = Record<string, never>;

type Step = {
  n: string;
  time: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  image: string;
  meta: React.ReactNode;
};

const STEPS: Step[] = [
  {
    n: "01",
    time: "~40s",
    icon: Wallet,
    title: "Connect wallet",
    desc: "Bring MetaMask, Ledger, or any WalletConnect signer. No custodial handoff.",
    image: "/images/pertials/network-map.webp",
    meta: <span className="font-mono text-[10px] text-muted-foreground/60">TICKET · #001</span>,
  },
  {
    n: "02",
    time: "~1m 20s",
    icon: ShieldCheck,
    title: "Verify identity",
    desc: "Streamlined KYC + Google Authenticator 2FA. Encrypted, never resold.",
    image: "/images/pertials/robot.webp",
    meta: <span className="text-[11px] tracking-[0.04em] text-primary/80">SOC 2 · GDPR</span>,
  },
  {
    n: "03",
    time: "~45s",
    icon: PieChart,
    title: "Pick a portfolio",
    desc: "Conservative, Balanced, or Aggressive — or build your own basket from 20+ assets.",
    image: "/images/pertials/coin.png",
    meta: (
      <div className="flex items-center gap-2">
        <span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] text-primary">BTC 40</span>
        <span className="rounded bg-white/6 px-2 py-0.5 font-mono text-[10px] text-foreground/90">ETH 35</span>
        <span className="rounded bg-white/6 px-2 py-0.5 font-mono text-[10px] text-foreground/90">+5</span>
      </div>
    ),
  },
  {
    n: "04",
    time: "LIVE",
    icon: TrendingUp,
    title: "Watch it compound",
    desc: "Daily rebalances, auto-compounded yields, withdrawals in seconds — 24/7.",
    image: "/images/pertials/network-map.webp",
    meta: <span className="font-hero text-[18px] text-primary">+11.8% APY</span>,
  },
];

const GUARANTEES: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: ShieldCheck, title: "MPC custody", sub: "No single key of failure" },
  { icon: BarChart3, title: "$0 minimum", sub: "Start with any amount" },
  { icon: Clock, title: "8-sec withdrawals", sub: "Median across 14 chains" },
  { icon: ListChecks, title: "Verifiable on-chain", sub: "Every fee, every trade" },
];

function StepCard({ step }: { step: Step }) {
  const Icon = step.icon;
  return (
    <article
      data-card
      className="group relative flex h-[420px] w-[82vw] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-3xl border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 p-8 transition-colors duration-500 hover:border-primary/30 sm:w-[400px] lg:p-10"
    >
      {/* Decorative illustration */}
      <img
        src={step.image}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -end-10 -bottom-10 size-64 object-contain opacity-20 transition duration-700 ease-[cubic-bezier(.22,1,.36,1)] will-change-[transform,opacity] group-hover:-translate-x-4 group-hover:-translate-y-4 group-hover:scale-125 group-hover:opacity-45"
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="grid size-14 place-items-center rounded-2xl border border-primary/40 bg-primary/12 text-primary transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-6">
            <Icon className="size-7" strokeWidth={1.8} />
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[12px] tracking-[0.06em] text-muted-foreground/70">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            {step.time}
          </span>
        </div>
        <h3 className="mt-6 font-hero text-[clamp(24px,2.6vw,32px)] leading-[1.1] font-bold text-foreground">
          {step.title}
        </h3>
        <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-muted-foreground">
          {step.desc}
        </p>
      </div>
      <div className="relative flex items-end justify-between gap-4">
        <span className="font-hero text-[clamp(34px,3vw,48px)] leading-none font-bold text-primary italic">
          {step.n}
        </span>
        <span className="flex items-center">{step.meta}</span>
      </div>
    </article>
  );
}

export function StepsHowItWorks({}: StepsHowItWorksProps) {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect: cleanup must run synchronously before React removes
  // this section on route change, or ctx.revert() un-pins too late and
  // React's removeChild targets a node GSAP's pin-spacer already moved.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const introItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const head = el.querySelector<HTMLElement>("[data-head]");

      if (prefersReducedMotion()) {
        gsap.set(introItems, { opacity: 1, y: 0 });
        if (head) gsap.set(head, { yPercent: 0 });
      } else {
        if (introItems.length) {
          gsap.from(introItems, {
            opacity: 0,
            y: 28,
            duration: 0.7,
            ease: REVEAL_EASE,
            stagger: 0.09,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "restart none none reset",
            },
          });
        }
        // Heading wipes up from behind its mask, like the hero headline.
        if (head) {
          gsap.from(head, {
            yPercent: 110,
            duration: 0.95,
            ease: "power4.out",
            delay: 0.1,
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "restart none none reset",
            },
          });
        }
        // Guarantee chips fade up together as the strip enters.
        const guars = gsap.utils.toArray<HTMLElement>("[data-guar]");
        if (guars.length) {
          gsap.from(guars, {
            autoAlpha: 0,
            y: 20,
            duration: 0.5,
            ease: REVEAL_EASE,
            stagger: 0.1,
            scrollTrigger: { trigger: guars[0], start: "top 90%", once: true },
          });
        }
      }

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const pin = pinRef.current;
          const track = trackRef.current;
          if (!pin || !track) return;
          const cards = Array.from(track.children) as HTMLElement[];

          // Phase 1 — one-shot: cards swipe in from the right, one after
          // another with a small delay, when the gallery hits mid-viewport.
          const intro = gsap.from(cards, {
            xPercent: 70,
            autoAlpha: 0,
            ease: "power3.out",
            duration: 0.7,
            stagger: 0.08,
            scrollTrigger: {
              trigger: pin,
              start: "top 55%",
              toggleActions: "restart none none reverse",
            },
          });

          // Phase 2 — pinned horizontal scrub: front cards exit left, the rest
          // arrive from the right; scrolling up reverses it.
          const distance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth + 96);
          const scroll = gsap.to(track, { x: () => -distance(), ease: "none" });
          const st = ScrollTrigger.create({
            trigger: pin,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            pinType: "transform",
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            animation: scroll,
          });

          return () => {
            intro.scrollTrigger?.kill();
            intro.kill();
            st.kill();
            scroll.kill();
          };
        },
      );

      ScrollTrigger.refresh();

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, []);

  const header = (
    <div className="mx-auto w-full max-w-[var(--maxw)] px-7">
      <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <div
            data-reveal
            className="mb-5 flex items-center gap-3 font-mono text-[12.5px] font-semibold tracking-[0.12em] text-primary uppercase"
          >
            How it works
          </div>
          <h2 className="max-w-[22ch] overflow-hidden pb-[0.12em] font-hero text-[clamp(36px,5vw,68px)] leading-[1.03] font-bold tracking-tight text-balance text-foreground">
            <span data-head className="block">
              From cold wallet to compounding — in{" "}
              <span className="text-primary italic">under 3 minutes</span>.
            </span>
          </h2>
        </div>
        <div data-reveal className="text-start lg:text-end">
          <div className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.06em] text-muted-foreground/70 lg:justify-end">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            AVG. ONBOARDING TIME
          </div>
          <div className="mt-1.5 font-hero text-[clamp(40px,6vw,60px)] leading-none text-foreground">
            02:47<span className="text-primary">.</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section
      ref={root}
      id="how-it-works"
      className="pt-[clamp(24px,4vw,56px)] pb-[clamp(70px,11vw,120px)]"
    >
      {/* Desktop: full-viewport pinned block — header stays, cards scroll left */}
      <div
        ref={pinRef}
        className="hidden h-screen flex-col justify-center overflow-hidden lg:flex"
      >
        {header}
        <div
          ref={trackRef}
          className="mt-10 flex gap-6 px-[max(28px,calc((100vw-var(--maxw))/2+28px))]"
        >
          {STEPS.map((s) => (
            <StepCard key={s.n} step={s} />
          ))}
        </div>
      </div>

      {/* Mobile: header + native horizontal swipe */}
      <div className="lg:hidden">
        {header}
        <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-7 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((s) => (
            <StepCard key={s.n} step={s} />
          ))}
        </div>
      </div>

      {/* Guarantees strip */}
      <div className="mx-auto mt-2 w-full max-w-[var(--maxw)] px-7 lg:mt-0">
        <div className="grid gap-6 rounded-[20px] border border-white/8 bg-linear-to-r from-primary/6 to-white/1 px-8 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((g) => {
            const Icon = g.icon;
            return (
              <div key={g.title} data-guar className="flex items-center gap-3.5">
                <Icon className="size-6 shrink-0 text-primary" strokeWidth={1.8} />
                <div>
                  <div className="text-[14px] font-semibold text-foreground">
                    {g.title}
                  </div>
                  <div className="text-[12px] text-muted-foreground/70">
                    {g.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
