"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Play } from "lucide-react";

import { gsap, ScrollTrigger, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type TestimonialsProps = Record<string, never>;

const CARD_BASE =
  "relative rounded-3xl border p-8 transition-[border-color,background] duration-400";
const CARD_PLAIN =
  "border-[color:var(--hairline)] bg-[color:var(--surface)] dark:border-white/8 dark:bg-linear-to-b dark:from-white/4 dark:to-white/1 hover:border-primary/35 dark:hover:from-primary/6 hover:bg-[color:var(--hairline)]/10";
const CARD_FEATURED =
  "border-primary/28 bg-linear-160 from-primary/14 to-primary/2";

function Avatar({
  initials,
  className = "",
  size = 44,
}: {
  initials: string;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold text-[#061916] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials}
    </span>
  );
}

function VerifiedBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/28 bg-primary/14 px-2.5 py-1 text-[11px] tracking-[0.06em] text-primary uppercase">
      {children}
    </span>
  );
}

export function Testimonials({}: TestimonialsProps) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const head = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      if (prefersReducedMotion()) {
        gsap.set([...head, ...cards], { opacity: 1, y: 0, scale: 1 });
        return;
      }
      if (head.length) {
        gsap.from(head, {
          opacity: 0,
          y: 24,
          duration: 0.7,
          ease: REVEAL_EASE,
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "restart none none reset",
          },
        });
      }
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 20,
          scale: 0.94,
          duration: 0.6,
          ease: REVEAL_EASE,
          stagger: 0.08,
          scrollTrigger: { trigger: cards[0], start: "top 85%", once: true },
        });
      }
      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="mx-auto w-full max-w-[var(--maxw)] px-7 py-[clamp(80px,12vw,140px)]"
    >
      {/* Header — editorial, offset */}
      <div className="mb-16 grid items-end gap-8 lg:grid-cols-[auto_1fr_auto] lg:gap-10">
        <div
          data-reveal
          className="font-hero text-[clamp(80px,12vw,160px)] leading-[0.85] text-primary italic"
        >
          148k
        </div>
        <div data-reveal>
          <div className="mb-3 font-mono text-[12.5px] font-semibold tracking-[0.12em] text-primary uppercase">
            Voices
          </div>
          <h2 className="max-w-[640px] font-hero text-[clamp(32px,4.4vw,52px)] leading-[1.05] font-bold tracking-tight text-balance text-foreground">
            Investors who <span className="text-primary italic">stay</span>. Not
            just sign up.
          </h2>
        </div>
        <div data-reveal className="flex gap-2">
          <button
            type="button"
            aria-label="Previous"
            className="grid size-11 place-items-center rounded-full border border-white/12 text-foreground transition-colors hover:bg-white/6"
          >
            <ArrowLeft className="size-4 rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="grid size-11 place-items-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
          >
            <ArrowRight className="size-4 rtl:-scale-x-100" />
          </button>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(200px,auto)]">
        {/* Featured 2x2 */}
        <div
          data-card
          className={`${CARD_BASE} ${CARD_FEATURED} flex flex-col justify-between sm:col-span-2 lg:row-span-2 lg:p-10`}
        >
          <span
            aria-hidden
            className="absolute -end-5 -top-5 size-15 animate-[spin_12s_linear_infinite] rounded-full border border-dashed border-primary/35"
          />
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <VerifiedBadge>
                <Check className="size-2.5" strokeWidth={3} />
                On-chain verified
              </VerifiedBadge>
              <span className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground/60">
                0xA1c7…8d2f
              </span>
            </div>
            <span className="font-hero text-[96px] leading-[0.4] text-primary/35 italic">
              &ldquo;
            </span>
            <blockquote className="mt-2 font-hero text-[clamp(22px,2.6vw,30px)] leading-[1.3] font-semibold text-balance text-foreground">
              The only platform where our risk desk, compliance, and traders all
              agree. It&apos;s how we deploy{" "}
              <span className="text-primary italic">nine figures</span> without
              losing sleep.
            </blockquote>
          </div>
          <div className="mt-7 flex items-center justify-between gap-4 border-t border-primary/18 pt-6">
            <div className="flex items-center gap-3.5">
              <Avatar
                initials="EM"
                className="bg-linear-135 from-primary to-[#1F8A6A]"
              />
              <div>
                <div className="font-semibold text-foreground">
                  Elena Morissette
                </div>
                <div className="text-[13px] text-primary/80">
                  Head of Digital Assets · Bergnaum
                </div>
              </div>
            </div>
            <div className="text-end">
              <div className="font-hero text-[clamp(32px,4vw,44px)] leading-none text-primary">
                +218%
              </div>
              <div className="mt-0.5 text-[12px] tracking-[0.04em] text-muted-foreground/70 uppercase">
                3-yr return
              </div>
            </div>
          </div>
        </div>

        {/* Compact quote */}
        <div data-card className={`${CARD_BASE} ${CARD_PLAIN}`}>
          <div className="mb-3 flex items-start justify-between">
            <div className="text-primary">★★★★★</div>
            <span className="font-mono text-[11px] tracking-[0.04em] text-muted-foreground/60">
              #0294
            </span>
          </div>
          <p className="font-hero text-[20px] leading-[1.35] font-semibold text-foreground/90">
            Custody I actually trust. Fees I can read. Rebalances I can prove.
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <Avatar initials="RW" size={32} className="bg-[#B4E8D4]" />
            <div>
              <div className="text-[13px] font-semibold text-foreground/90">
                Ruth Wisozk
              </div>
              <div className="text-[11px] text-muted-foreground/70">
                DAO Treasurer, StroDAO
              </div>
            </div>
          </div>
        </div>

        {/* Metric card */}
        <div
          data-card
          className={`${CARD_BASE} ${CARD_PLAIN} flex flex-col justify-between`}
        >
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-2)] px-3 py-1.5 text-[12px] text-muted-foreground dark:border-white/8 dark:bg-white/4">
              Portfolio · Balanced
            </span>
            <div className="mt-4 font-hero text-[44px] leading-none text-primary">
              11.8<span className="text-[24px]">% APY</span>
            </div>
          </div>
          <svg
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
            className="mt-3 block h-10 w-full"
            aria-hidden
          >
            <path
              d="M0 30 Q30 26 50 22 T100 14 T150 10 T200 4 L200 40 L0 40 Z"
              fill="hsl(var(--primary)/0.12)"
            />
            <path
              d="M0 30 Q30 26 50 22 T100 14 T150 10 T200 4"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="200" cy="4" r="3" fill="hsl(var(--primary))" />
          </svg>
          <div className="mt-3 flex justify-between text-[12px] text-muted-foreground/70">
            <span>Jan &apos;24</span>
            <span>Jul &apos;26</span>
          </div>
        </div>

        {/* Tweet-style */}
        <div data-card className={`${CARD_BASE} ${CARD_PLAIN}`}>
          <div className="mb-3.5 flex items-center gap-2.5">
            <Avatar initials="JB" size={36} className="bg-[#F0D8A8]" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-foreground/90">
                Julian Barrows
              </div>
              <div className="text-[12px] text-muted-foreground/70">
                @jbarrows · GP, Reichel Ventures
              </div>
            </div>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="fill-primary"
              aria-hidden
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <p className="text-[15px] leading-[1.5] text-foreground/90">
            Been running six figures through{" "}
            <span className="text-primary">@CrypInvest</span> for 14 months. Zero
            drama. Withdrawals in 8 seconds. This is the future of on-chain wealth
            mgmt.
          </p>
          <div className="mt-4 flex gap-5 text-[12px] text-muted-foreground/70">
            <span>♡ 4.2k</span>
            <span>↻ 890</span>
            <span>💬 210</span>
          </div>
        </div>

        {/* Tall NPS tile */}
        <div
          data-card
          className={`${CARD_BASE} ${CARD_FEATURED} flex flex-col justify-between lg:row-span-2`}
        >
          <div>
            <span className="inline-flex items-center rounded-full border border-primary/25 bg-[color:var(--surface-2)] px-3 py-1.5 text-[12px] text-primary/90">
              Institutional NPS
            </span>
            <div className="mt-5 font-hero text-[clamp(64px,10vw,96px)] leading-[0.9] text-foreground">
              4.9<span className="text-primary">.</span>
            </div>
            <div className="mt-2 text-[14px] text-muted-foreground">
              Out of 5 · from 40+ funds
            </div>
          </div>
          <div>
            <div className="my-6 h-px bg-primary/18" />
            <div className="mb-3 text-[12px] tracking-[0.08em] text-muted-foreground/70 uppercase">
              Referenced by
            </div>
            <div className="flex flex-wrap gap-2">
              {["Reichel", "Bergnaum", "Wisozk", "Strosin"].map((n) => (
                <span
                  key={n}
                  className="rounded-md bg-[color:var(--surface-2)] border border-[color:var(--hairline)] px-2.5 py-1.5 font-hero text-[13px] text-foreground/90 dark:border-0 dark:bg-white/5"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Video-style */}
        <div
          data-card
          className={`${CARD_BASE} ${CARD_PLAIN} grid items-center gap-6 sm:col-span-2 lg:grid-cols-[140px_1fr]`}
        >
          <div className="relative grid min-h-[140px] place-items-center overflow-hidden rounded-2xl bg-linear-135 from-[#0A2A22] to-primary">
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.5),transparent_60%)]"
            />
            <span className="relative grid size-11 place-items-center rounded-full bg-white/95">
              <Play className="size-4 fill-[#061916] text-[#061916]" />
            </span>
            <span className="absolute bottom-2 start-2 rounded bg-[#061916]/60 px-1.5 py-0.5 text-[10px] text-foreground">
              2:14
            </span>
          </div>
          <div>
            <VerifiedBadge>Watch story</VerifiedBadge>
            <p className="mt-2 font-hero text-[20px] leading-[1.35] font-semibold text-foreground/90">
              &ldquo;I moved my family&apos;s savings on-chain last year.
              CrypInvest was the reason I could actually sleep.&rdquo;
            </p>
            <div className="mt-3.5 flex items-center gap-2.5 text-[13px] text-muted-foreground">
              <Avatar initials="SG" size={28} className="bg-[#D8B4E8]" />
              <span>
                <span className="font-semibold text-foreground/90">
                  Sasha Gleichner
                </span>{" "}
                · Retail investor, Berlin
              </span>
            </div>
          </div>
        </div>

        {/* Aphorism */}
        <div
          data-card
          className={`${CARD_BASE} ${CARD_PLAIN} flex flex-col justify-between`}
        >
          <p className="font-hero text-[22px] leading-[1.3] text-foreground italic">
            &ldquo;Boring. And I mean that as the highest compliment.&rdquo;
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            <Avatar initials="DM" size={32} className="bg-[#A8D8B4]" />
            <div>
              <div className="text-[13px] font-semibold text-foreground/90">
                Dara Mertz
              </div>
              <div className="text-[11px] text-muted-foreground/70">
                CFO, Strosin Labs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rail */}
      <div
        data-reveal
        className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface)] px-7 py-5 dark:border-white/8 dark:bg-white/2"
      >
        <div className="flex items-center gap-3">
          <div className="flex">
            {[
              { i: "EM", c: "bg-primary" },
              { i: "RW", c: "bg-[#B4E8D4]" },
              { i: "JB", c: "bg-[#F0D8A8]" },
              { i: "SG", c: "bg-[#D8B4E8]" },
              { i: "+", c: "bg-[color:var(--surface-2)] border border-[color:var(--hairline)] dark:border-0 dark:bg-white/6 text-foreground" },
            ].map((a, idx) => (
              <Avatar
                key={a.i}
                initials={a.i}
                size={32}
                className={`${a.c} border-2 border-background ${idx > 0 ? "-ms-2.5" : ""}`}
              />
            ))}
          </div>
          <div className="text-[14px] text-muted-foreground">
            Join <span className="font-semibold text-foreground">148,000+</span>{" "}
            investors already on-chain.
          </div>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full bg-(image:--gradient) px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Read all reviews
          <ArrowRight className="size-4 rtl:-scale-x-100" />
        </a>
      </div>
    </section>
  );
}
