"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";

import { gsap, ScrollTrigger, SplitText, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type AboutProps = Record<string, never>;

type Milestone = {
  year: string;
  body: string;
  now?: boolean;
};

const MILESTONES: Milestone[] = [
  { year: "2021", body: "Founded in Brooklyn. Two engineers, one thesis." },
  { year: "2022", body: "$12M Series A led by Bergnaum Capital." },
  { year: "2023", body: "SOC 2 Type II certified. $400M in AUM." },
  { year: "2024", body: "14-chain expansion. Team of 84." },
  { year: "Today", body: "$2.4B AUM · 148k investors in 62 countries.", now: true },
];

type Principle = {
  roman: string;
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    roman: "I.",
    title: "Security is a first-order product decision.",
    body: "MPC custody, SOC 2 Type II, quarterly proof-of-reserves. Zero breaches since day one.",
  },
  {
    roman: "II.",
    title: "Every strategy is verifiable on-chain.",
    body: "Fees, holdings, rebalances — public, timestamped, and auditable in real time.",
  },
  {
    roman: "III.",
    title: "Compounding beats extraction.",
    body: "We charge less. We hold longer. We never run a token or a treasury against our users.",
  },
  {
    roman: "IV.",
    title: "Boring is a feature.",
    body: "Serious capital deserves calm interfaces, predictable behavior, and no surprises.",
  },
];

export function About({}: AboutProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const manifesto = el.querySelector<HTMLElement>("[data-manifesto]");
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      // Manifesto reveals line-by-line, each wiping up from behind a mask.
      if (manifesto) {
        const split = new SplitText(manifesto, {
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
            trigger: manifesto,
            start: "top 82%",
            toggleActions: "restart none none reset",
          },
        });
      }

      if (items.length) {
        gsap.from(items, {
          opacity: 0,
          y: 26,
          duration: 1.1,
          delay: 0.2,
          ease: REVEAL_EASE,
          stagger: 0.28,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "restart none none reset",
          },
        });
      }

      const group = (
        sel: string,
        vars: gsap.TweenVars,
        triggerSel?: string,
      ) => {
        const nodes = gsap.utils.toArray<HTMLElement>(sel);
        if (!nodes.length) return;
        const trigger = triggerSel
          ? el.querySelector<HTMLElement>(triggerSel) ?? nodes[0]
          : nodes[0];
        gsap.from(nodes, {
          ...vars,
          scrollTrigger: { trigger, start: "top 85%", once: true },
        });
      };

      // Timeline line draws left→right; milestones pop up in sequence.
      const line = el.querySelector<HTMLElement>("[data-line]");
      if (line) {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: line, start: "top 88%", once: true },
        });
      }
      group("[data-mile]", {
        autoAlpha: 0,
        y: 26,
        scale: 0.9,
        transformOrigin: "center",
        duration: 0.55,
        ease: "back.out(1.4)",
        stagger: 0.12,
      });
      // Principles slide in from the start edge, one after another.
      group("[data-principle]", {
        autoAlpha: 0,
        x: -28,
        duration: 0.6,
        ease: REVEAL_EASE,
        stagger: 0.12,
      });

      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      id="about"
      className="mx-auto w-full max-w-[var(--maxw)] px-7 py-[clamp(80px,12vw,140px)]"
    >
      {/* Eyebrow row */}
      <div data-reveal className="mb-10 flex items-center gap-5">
        <span className="font-mono text-[12.5px] font-semibold tracking-[0.14em] text-primary uppercase">
          About
        </span>
        <span className="h-px flex-1 bg-linear-to-r from-primary/40 to-transparent" />
      </div>

      {/* Manifesto statement */}
      <div className="relative mb-24">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-14 -start-4 font-hero text-[clamp(120px,20vw,260px)] leading-none text-primary/[0.06] italic"
        >
          &ldquo;
        </span>
        <p
          data-manifesto
          className="relative max-w-[20ch] font-hero text-[clamp(30px,5.2vw,68px)] leading-[1.08] font-semibold tracking-tight text-balance text-foreground lg:max-w-[1120px]"
        >
          We are <span className="text-primary italic">builders</span>, not
          brokers — traders, cryptographers, and risk engineers building the
          investment platform we always wished existed
          <span className="ms-1.5 inline-block h-[0.8em] w-[3px] translate-y-[0.08em] animate-pulse bg-primary align-middle" />
        </p>

        <div data-reveal className="mt-12 flex items-center gap-5">
          <div>
            <div className="font-hero text-[clamp(26px,3vw,34px)] text-primary italic">
              Ada &amp; Ren
            </div>
            <div className="mt-1 text-[13px] tracking-[0.06em] text-muted-foreground/70 uppercase">
              Co-founders, QRSim
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal timeline */}
      <div data-reveal className="relative mb-24">
        <span
          data-line
          aria-hidden
          className="absolute inset-x-0 top-5 hidden h-px origin-left bg-linear-to-r from-transparent via-primary/40 to-transparent lg:block"
        />
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {MILESTONES.map((m) => (
            <div
              key={m.year}
              data-mile
              className="group relative text-center text-muted-foreground transition-transform duration-400 hover:-translate-y-1"
            >
              <span
                className={`mx-auto mt-3.5 block rounded-full transition-all duration-400 ${
                  m.now
                    ? "size-3.5 bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)]"
                    : "size-3 bg-muted-foreground/40 group-hover:scale-150 group-hover:bg-primary group-hover:shadow-[0_0_0_6px_hsl(var(--primary)/0.15)]"
                }`}
              />
              <div
                className={`mt-6 font-hero text-[clamp(24px,3vw,32px)] ${m.now ? "text-primary" : "text-foreground"}`}
              >
                {m.year}
              </div>
              <p className="mt-1 text-[13px] leading-relaxed transition-colors duration-400 group-hover:text-primary">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: principles + receipt card */}
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-20">
        {/* Numbered principles */}
        <div data-reveal>
          <div className="mb-5 font-mono text-[12.5px] font-semibold tracking-[0.12em] text-primary uppercase">
            The four principles
          </div>
          {PRINCIPLES.map((p) => (
            <div
              key={p.roman}
              data-principle
              className="group grid grid-cols-[48px_1fr] gap-6 py-6 transition-[padding] duration-400 hover:ps-3"
            >
              <div className="font-hero text-[28px] leading-none text-muted-foreground/40 italic transition-colors duration-400 group-hover:text-primary">
                {p.roman}
              </div>
              <div>
                <div className="mb-1.5 font-hero text-[clamp(20px,2.2vw,24px)] text-foreground">
                  {p.title}
                </div>
                <div className="text-[15px] leading-relaxed text-muted-foreground">
                  {p.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Receipt counters card */}
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-160 from-primary/10 to-primary/[0.01] p-10 lg:sticky lg:top-24"
        >
          <span
            aria-hidden
            className="absolute -end-12 -top-12 size-52 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.28),transparent_70%)] blur-2xl"
          />
          {/* Orbit ring — dashed circle with a glowing dot riding its edge. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -end-16 -top-16 size-48 animate-[spin_30s_linear_infinite] rounded-full border border-dashed border-primary/30"
          >
            <span className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          </span>
          <div className="relative">
            <div className="mb-6 flex items-center gap-2 font-mono text-[12.5px] font-semibold tracking-[0.12em] text-primary/90 uppercase">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              The receipt
            </div>

            <Counter value="148k" label="Investors served" dot />
            <Divider />
            <Counter value="62" label="Countries reached" dot />
            <Divider />
            <div>
              <div className="flex items-center gap-3 font-hero text-[clamp(42px,6vw,56px)] leading-none text-foreground">
                0
                <span className="grid size-7 place-items-center rounded-full bg-primary/15">
                  <Check className="size-4 text-primary" strokeWidth={3} />
                </span>
              </div>
              <div className="mt-1.5 text-[13px] tracking-[0.06em] text-muted-foreground/70 uppercase">
                Security breaches
              </div>
            </div>

            <a
              href="#"
              className="mt-9 flex items-center justify-between gap-4 rounded-full bg-primary px-5 py-4 text-[15px] font-semibold text-[#061916] transition-opacity hover:opacity-90"
            >
              <span>Read our disclosures</span>
              <ArrowRight className="size-4 rtl:-scale-x-100" strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({
  value,
  label,
  dot,
}: {
  value: string;
  label: string;
  dot?: boolean;
}) {
  return (
    <div>
      <div className="font-hero text-[clamp(42px,6vw,56px)] leading-none text-foreground">
        {value}
        {dot && <span className="text-primary">.</span>}
      </div>
      <div className="mt-1.5 text-[13px] tracking-[0.06em] text-muted-foreground/70 uppercase">
        {label}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-7 h-px bg-primary/15" />;
}
