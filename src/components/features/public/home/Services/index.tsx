"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowRightLeft,
  BarChart3,
  CircleDollarSign,
  ShieldCheck,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type ServicesProps = Record<string, never>;

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const SERVICES: Service[] = [
  {
    title: "Secure Crypto Wallet",
    description:
      "State-of-the-art security protocols shield your cryptocurrencies, keeping your digital wealth impenetrable — manage and access assets anytime, anywhere.",
    icon: Wallet,
  },
  {
    title: "Investment Potential",
    description:
      "Curate a balanced strategy from 20+ cryptocurrencies. Capitalize on the diverse dynamics of the digital currency landscape.",
    icon: TrendingUp,
  },
  {
    title: "Financial Growth",
    description:
      "Plans aligned with your aspirations. Achieve optimal growth and maximize returns through intelligently designed investment options.",
    icon: BarChart3,
  },
  {
    title: "Fund Management",
    description:
      "Add money, transfer funds, and monitor investments with ease. React promptly to market opportunities in a single interface.",
    icon: ArrowRightLeft,
  },
  {
    title: "Access to Profits",
    description:
      "Convert investments into real-world gains. Enjoy the flexibility and speed of instant withdrawals across 14 chains.",
    icon: CircleDollarSign,
  },
  {
    title: "Security Measures",
    description:
      "KYC verification and Google Authenticator fortify your account against unauthorized access. Protect your holdings and financial future.",
    icon: ShieldCheck,
  },
];

const num2 = (i: number) => String(i + 1).padStart(2, "0");

function AccordionPanel({
  service,
  index,
  active,
  onSelect,
}: {
  service: Service;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = service.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative h-[360px] min-w-0 overflow-hidden rounded-3xl border bg-linear-160 from-primary/12 to-primary/2 text-start transition-[border-color,box-shadow] duration-500",
        active
          ? "border-primary/25 shadow-lift"
          : "cursor-pointer border-primary/12 hover:border-primary/25",
      )}
    >
      {/* Dot-shape texture, recolored to primary via alpha mask — fades in
          only on the active (expanded) panel. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 end-0 w-[60%] bg-primary transition-opacity duration-500 [mask-image:url(/images/pertials/dot-shap.png)] [mask-position:center_right] [mask-repeat:no-repeat] [mask-size:contain]",
          active ? "opacity-40" : "opacity-0",
        )}
      />

      {/* Active (expanded) content */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col p-8 transition-opacity duration-500 lg:p-12",
          active ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <span
          data-el
          className="grid size-14 place-items-center rounded-2xl border border-primary/40 bg-primary/12 text-primary"
        >
          <Icon className="size-7" />
        </span>
        <h3
          data-el
          className="mt-6 font-hero text-[clamp(26px,3vw,40px)] leading-[1.05] font-bold text-foreground"
        >
          {service.title}
        </h3>
        <p
          data-el
          className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground lg:text-base"
        >
          {service.description}
        </p>
        <div data-el className="mt-auto flex items-center justify-between gap-4">
          <span className="font-hero text-[clamp(30px,3vw,48px)] leading-none font-bold text-primary italic">
            {num2(index)}
          </span>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
            See more
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </span>
        </div>
      </div>

      {/* Collapsed (tab) content */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-between py-7 transition-opacity duration-300",
          active ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <span className="font-hero text-lg leading-none font-bold text-muted-foreground/50 italic">
          {num2(index)}
        </span>
        <span className="[writing-mode:vertical-rl] rotate-180 text-[13px] font-semibold tracking-wide whitespace-nowrap text-muted-foreground">
          {service.title}
        </span>
        <span className="font-hero text-lg leading-none font-bold text-muted-foreground/30 italic">
          {num2(index)}
        </span>
      </div>
    </button>
  );
}

function ServicesIntro() {
  return (
    <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_400px]">
      <div>
        <span
          data-reveal
          className="inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold tracking-[0.18em] text-primary uppercase rtl:tracking-[0.04em]"
        >
          Service
        </span>

        <h2
          data-reveal
          className="mt-5 max-w-[22ch] font-hero text-[clamp(36px,5vw,68px)] leading-[1.03] font-bold tracking-tight text-foreground"
        >
          Best services &amp; a{" "}
          <span className="text-primary italic">secure</span> investment
          platform.
        </h2>

        <p
          data-reveal
          className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground"
        >
          Six pillars — from custody to withdrawal — engineered to move capital
          on-chain without compromise.
        </p>

        <Link
          data-reveal
          href="#services"
          className="group/link mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
        >
          Explore all services
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/link:translate-x-1 rtl:-scale-x-100" />
        </Link>
      </div>

      {/* Coin visual (replaces the live stat panel) */}
      <div data-reveal className="relative grid place-items-center">
        <span
          aria-hidden
          className="pointer-events-none absolute size-64 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.28),transparent_70%)] blur-2xl"
        />
        <Image
          src="/images/pertials/coin.png"
          alt=""
          width={640}
          height={640}
          priority
          className="relative h-auto w-[min(360px,80%)] select-none object-contain drop-shadow-[0_24px_60px_hsl(var(--primary)/0.45)]"
        />
      </div>
    </div>
  );
}

export function Services({}: ServicesProps) {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const N = SERVICES.length;

  // When the active panel changes, stagger-reveal its inner items (delayed so
  // they arrive after the panel has widened). No flip — just a smooth cascade.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const row = rowRef.current;
    if (!row) return;
    const panel = row.children[active] as HTMLElement | undefined;
    const els = panel?.querySelectorAll("[data-el]");
    if (!els?.length) return;
    const anim = gsap.fromTo(
      els,
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        ease: REVEAL_EASE,
        stagger: 0.1,
        delay: 0.2,
        overwrite: true,
      },
    );
    return () => {
      anim.kill();
    };
  }, [active]);

  // useLayoutEffect: cleanup must run synchronously before React removes
  // this section on route change, or ctx.revert() un-pins too late and
  // React's removeChild targets a node GSAP's pin-spacer already moved.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const introItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      const stats = gsap.utils.toArray<HTMLElement>("[data-stat]");
      const spark = el.querySelector<SVGPathElement>("[data-spark]");

      if (prefersReducedMotion()) {
        gsap.set([...introItems, ...stats], { opacity: 1, y: 0 });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "restart none none reset",
          },
        });
        if (introItems.length) {
          tl.from(introItems, {
            opacity: 0,
            y: 48,
            duration: 0.8,
            ease: REVEAL_EASE,
            stagger: 0.13,
          });
        }
        // Stat-panel internals pop in, then the sparkline draws itself.
        if (stats.length) {
          tl.from(
            stats,
            {
              opacity: 0,
              y: 16,
              scale: 0.96,
              transformOrigin: "left center",
              duration: 0.5,
              ease: "back.out(1.4)",
              stagger: 0.1,
            },
            "-=0.35",
          );
        }
        if (spark) {
          const len = spark.getTotalLength();
          tl.from(
            spark,
            {
              strokeDasharray: len,
              strokeDashoffset: len,
              duration: 1,
              ease: "power2.out",
            },
            "-=0.4",
          );
        }
        // Accordion panels rise up from below, one after another (delayed).
        if (rowRef.current) {
          tl.from(
            Array.from(rowRef.current.children),
            {
              autoAlpha: 0,
              y: 70,
              duration: 0.7,
              ease: REVEAL_EASE,
              stagger: 0.1,
            },
            "-=0.5",
          );
        }
      }

      const mm = gsap.matchMedia();

      // Desktop: pin the WHOLE section (intro + accordion); scroll advances the
      // active (expanded) panel while everything stays fixed on screen.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const st = ScrollTrigger.create({
            trigger: el,
            start: "top top",
            end: () => "+=" + (N - 1) * Math.round(window.innerHeight),
            pin: el,
            pinType: "transform",
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // Settle on each panel so the width transition never fights scroll.
            snap: {
              snapTo: 1 / (N - 1),
              duration: { min: 0.2, max: 0.5 },
              ease: "power1.inOut",
            },
            onUpdate: (self) =>
              setActive(Math.round(self.progress * (N - 1))),
          });

          return () => st.kill();
        },
      );

      // Mobile / reduced motion: plain vertical list.
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        const list = listRef.current;
        if (!list) return;
        const cards = Array.from(list.children);
        if (prefersReducedMotion()) {
          gsap.set(cards, { autoAlpha: 1, y: 0 });
          return;
        }
        gsap.from(cards, {
          autoAlpha: 0,
          y: 40,
          duration: 0.6,
          ease: REVEAL_EASE,
          stagger: 0.14,
          scrollTrigger: { trigger: list, start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    }, el);

    return () => ctx.revert();
  }, [N]);

  return (
    <section
      ref={root}
      id="services"
      className="pt-[clamp(24px,4vw,56px)] pb-[clamp(70px,11vw,120px)]"
    >
      {/* Intro (top) */}
      <div className="mx-auto w-full max-w-[var(--maxw)] px-7">
        <ServicesIntro />
      </div>

      {/* Desktop: pinned horizontal accordion */}
      <div ref={pinRef} className="mt-10 hidden lg:block">
        <div className="flex items-center py-6">
          <div
            ref={rowRef}
            style={{
              gridTemplateColumns: SERVICES.map((_, i) =>
                i === active ? "10fr" : "1fr",
              ).join(" "),
            }}
            className="mx-auto grid w-full max-w-[var(--maxw)] gap-3 px-7 transition-[grid-template-columns] duration-1000 ease-[cubic-bezier(.22,1,.36,1)]"
          >
            {SERVICES.map((s, i) => (
              <AccordionPanel
                key={s.title}
                service={s}
                index={i}
                active={active === i}
                onSelect={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: vertical list */}
      <div
        ref={listRef}
        className="mx-auto mt-12 flex w-full max-w-[var(--maxw)] flex-col gap-6 px-7 lg:hidden"
      >
        {SERVICES.map((s, i) => (
          <article
            key={s.title}
            className="flex flex-col gap-4 rounded-3xl border border-[color:var(--hairline-strong)] bg-[color:var(--surface-solid)] p-7 shadow-lift"
          >
            <div className="flex items-center gap-4">
              <span className="font-hero text-4xl leading-none font-bold text-primary italic">
                {num2(i)}
              </span>
              <span className="grid size-12 place-items-center rounded-2xl border border-primary/40 bg-primary/12 text-primary">
                <s.icon className="size-6" />
              </span>
            </div>
            <h3 className="font-hero text-2xl leading-tight font-bold text-foreground">
              {s.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-muted-foreground">
              {s.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
