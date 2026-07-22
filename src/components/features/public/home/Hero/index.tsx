"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Bitcoin, QrCode, Settings, ShieldCheck, Star, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { gsap, ScrollTrigger, REVEAL_EASE } from "@/lib/gsap";

export type HeroProps = Record<string, never>;

/**
 * Two-state hero. On load the phone slides in from the start edge, the card
 * follows, and the headline / copy arrive from the top-end while the bottom row
 * rises. On scroll the section pins: the phone+card cluster eases to the end
 * side, the copy fades out, and a feature panel reveals on the start side.
 * Theme-aware via semantic tokens (light look ↔ dark look, no hardcoded white).
 */
export function Hero({}: HeroProps) {
  const t = useTranslations("home");
  const root = useRef<HTMLDivElement>(null);

  const features = [
    { icon: Zap, title: t("hero.feat1Title"), sub: t("hero.feat1Sub") },
    {
      icon: ShieldCheck,
      title: t("hero.feat2Title"),
      sub: t("hero.feat2Sub"),
    },
  ];

  const cryptoTx = [
    {
      title: "Bitcoin (BTC)",
      sub: "bc1q…x78ujk",
      amount: "+0.2356 BTC",
      fiat: "€432.49",
    },
    {
      title: "Bitcoin (BTC)",
      sub: "Waiting for deposit",
      amount: "+0.2356 BTC",
      fiat: "€432.49",
    },
  ];

  const renderTx = (c: (typeof cryptoTx)[number]) => (
    <div className="flex items-center gap-3 rounded-2xl border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 px-4 py-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f7931a] text-white">
        <Bitcoin className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-foreground">
          {c.title}
        </div>
        <div className="truncate text-xs text-muted-foreground">{c.sub}</div>
      </div>
      <div className="shrink-0 text-end">
        <div className="text-sm font-semibold text-primary">{c.amount}</div>
        <div className="text-xs text-muted-foreground">{c.fiat}</div>
      </div>
    </div>
  );

  // useLayoutEffect: cleanup must run synchronously before React removes
  // this section on route change, or ctx.revert() un-pins too late and
  // React's removeChild targets a node GSAP's pin-spacer already moved.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const headline = q("[data-hero='headline']");
      const headlineInner = q("[data-hero='headlineInner']");
      const stage = q("[data-hero='stage']");
      const copy = q("[data-hero='copy']");
      const bottom = q("[data-hero='bottom']");
      const phone = q("[data-hero='phone']");
      const card = q("[data-hero='card']");
      const panel = q("[data-hero='panel']");
      const txItems = q("[data-hero='tx']");
      const trust = q("[data-hero='trust']");
      const panelItems = q("[data-hero='panel-item']");

      // Ease the phone + card upward (ease-out) — card trails, slower.
      const phoneToTop = () => {
        const phoneEl = phone[0] as HTMLElement | undefined;
        const cardEl = card[0] as HTMLElement | undefined;
        if (phoneEl) {
          gsap.to(phoneEl, { yPercent: -180, ease: "power2.out", duration: 1.8 });
        }
        if (cardEl) {
          gsap.to(cardEl, { yPercent: -180, ease: "power2.out", duration: 2.8 });
        }
      };

      // Scrolling back up returns the phone + card to their rest position.
      const phoneReset = () => {
        const phoneEl = phone[0] as HTMLElement | undefined;
        const cardEl = card[0] as HTMLElement | undefined;
        if (phoneEl) {
          gsap.to(phoneEl, { yPercent: 0, ease: "power2.out", duration: 1.8 });
        }
        if (cardEl) {
          gsap.to(cardEl, { yPercent: 0, ease: "power2.out", duration: 2.8 });
        }
      };

      const mm = gsap.matchMedia();

      // Desktop: full scrollytelling — load intro + pinned swap.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(panel, { autoAlpha: 0, xPercent: -8 });
          gsap.set(panelItems, { autoAlpha: 0, y: 20 });

          // Load intro — headline visible from the start.
          const intro = gsap.timeline({
            defaults: { ease: REVEAL_EASE, duration: 0.9 },
          });
          intro
            .from(headline, { y: -44, autoAlpha: 0 })
            .from(phone, { xPercent: -60, rotation: -10, autoAlpha: 0 }, 0.05)
            .from(card, { xPercent: -35, yPercent: 22, rotation: 10, autoAlpha: 0 }, 0.35)
            .from(copy, { x: 90, autoAlpha: 0 }, 0.2)
            .from(bottom, { y: 60, autoAlpha: 0 }, 0.45)
            // Crypto items bubble in like the trust badge: scale small → big.
            .from(
              txItems,
              {
                scale: 0,
                autoAlpha: 0,
                transformOrigin: "center",
                ease: "back.out(1.7)",
                duration: 0.5,
                stagger: 0.12,
              },
              0.6,
            );

          // Build the scrub swap ONLY after the intro settles, so plain .to tweens
          // capture the true rest state as their start. That makes reverse native:
          // scrolling back to the top returns exactly to the reload-finished look.
          let swap: gsap.core.Timeline | undefined;
          let swapTrigger: ScrollTrigger | undefined;
          let phoneTrigger: ScrollTrigger | undefined;
          const buildSwap = () => {
            if (!el.isConnected) return;
            // Self-driven timeline (NOT scrubbed): a single scroll hit plays the
            // whole swap to completion at its own pace, like the service card;
            // scrolling back up reverses it.
            swap = gsap.timeline({ paused: true });
            swap
              // Header text exits up, cut off from the bottom by its mask.
              .to(headlineInner, { yPercent: -140, ease: "power2.in", duration: 1 }, 0)
              // Stage rises into the gap the exiting headline leaves behind.
              .to(stage, { y: -160, ease: "power2.out", duration: 0.8 }, 0.1)
              // Phone is fast: reaches the right early (short span).
              .to(phone, { xPercent: 190, rotation: 10, ease: "power2.out", duration: 0.55 }, 0)
              // Card is slow: trails behind, crawling across the full scroll.
              .to(card, { xPercent: 100, rotation: 10, ease: "power1.out", duration: 0.9 }, 0.1)
              .to(copy, { autoAlpha: 0, x: 70, ease: "power1.out", duration: 0.6 }, 0)
              // Crypto items bubble out on scroll (and bubble back on reverse).
              .to(
                txItems,
                {
                  scale: 0,
                  autoAlpha: 0,
                  transformOrigin: "center",
                  ease: "back.in(1.7)",
                  duration: 0.45,
                  stagger: 0.08,
                },
                0,
              )
              .to(panel, { autoAlpha: 1, xPercent: 0, ease: "power2.out", duration: 0.7 }, 0.3)
              // Panel items reveal one by one.
              .to(
                panelItems,
                {
                  autoAlpha: 1,
                  y: 0,
                  ease: "power2.out",
                  duration: 0.5,
                  stagger: 0.18,
                },
                0.4,
              )
              // Trust badge bubbles in as the panel reveals.
              .from(
                trust,
                {
                  scale: 0,
                  autoAlpha: 0,
                  transformOrigin: "center",
                  ease: "back.out(1.7)",
                  duration: 0.5,
                },
                0.55,
              );

            // Pin the hero and drive the timeline by scroll DIRECTION, not
            // amount: one scroll hit past the threshold plays the whole swap;
            // scrolling back up reverses it. Snap keeps the pin settled at the
            // start or end so a single gesture always finishes the animation.
            swapTrigger = ScrollTrigger.create({
              trigger: el,
              start: "top top",
              end: "+=100%",
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              snap: {
                snapTo: [0, 1],
                duration: { min: 0.2, max: 0.5 },
                directional: true,
              },
              onUpdate: (self) => {
                if (self.progress > 0.05) swap?.play();
                else swap?.reverse();
              },
            });

            // Phone eases up when the hero's bottom hits the viewport middle,
            // and returns on the way back up.
            phoneTrigger = ScrollTrigger.create({
              trigger: el,
              start: "bottom center",
              onEnter: phoneToTop,
              onLeaveBack: phoneReset,
            });

            ScrollTrigger.refresh();
          };
          intro.eventCallback("onComplete", buildSwap);

          // Clean up the async-built animations on revert.
          return () => {
            swapTrigger?.kill();
            swap?.kill();
            phoneTrigger?.kill();
          };
        },
      );

      // Mobile / reduced motion: soft fade-up, nothing pinned or hidden.
      mm.add(
        "(max-width: 1023px), (prefers-reduced-motion: reduce)",
        () => {
          gsap.set(panel, { autoAlpha: 1, xPercent: 0 });
          gsap.from([...txItems, ...trust], {
            scale: 0,
            autoAlpha: 0,
            transformOrigin: "center",
            ease: "back.out(1.7)",
            duration: 0.6,
            stagger: 0.14,
            delay: 0.3,
          });
          gsap.from([headline, phone, card, copy, panel, bottom], {
            y: 30,
            autoAlpha: 0,
            duration: 0.7,
            ease: REVEAL_EASE,
            stagger: 0.08,
          });

          // Phone eases up when the hero's bottom hits the viewport middle,
          // and returns on the way back up.
          const phoneTrigger = ScrollTrigger.create({
            trigger: el,
            start: "bottom center",
            onEnter: phoneToTop,
            onLeaveBack: phoneReset,
          });

          return () => phoneTrigger.kill();
        },
      );

      return () => mm.revert();
    }, el);

    // Recalculate after fonts / images settle.
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden">
      <div
        data-hero="content"
        className="mx-auto w-full max-w-[1240px] px-[clamp(20px,6vw,72px)] py-[clamp(64px,11vh,120px)]"
      >
        {/* Headline — full width, top. Text is masked; the inner line wipes
            up (bottom→top) as the section swaps on scroll. */}
        <h1
          data-hero="headline"
          className="overflow-hidden pb-[0.12em] text-center font-hero text-[clamp(32px,6vw,80px)] leading-[1.05] font-bold tracking-tight text-foreground"
        >
          <span data-hero="headlineInner" className="block">
            {t("hero.title")}{" "}
            <span className="text-primary italic">{t("hero.titleG")}</span>
          </span>
        </h1>

        {/* Stage */}
        <div data-hero="stage" className="relative mt-8 lg:mt-12 lg:h-[560px]">
          {/* Phone + card cluster (start side) */}
          <div
            data-hero="cluster"
            className="relative z-[2] mx-auto w-[min(560px,92vw)] origin-top lg:absolute lg:inset-y-0 lg:start-0 lg:mx-0 lg:w-[52%]"
          >
            <div className="relative mx-auto aspect-[664/900] w-full max-w-[520px]">
              <div
                data-hero="phone"
                className="absolute start-0 top-0 w-[68%] rotate-[-5deg] drop-shadow-[0_30px_60px_hsl(203_76%_8%/0.28)]"
              >
                <Image
                  src="/images/hero/phone.webp"
                  alt=""
                  width={664}
                  height={1254}
                  priority
                  className="h-auto w-full select-none"
                />
              </div>
              <div
                data-hero="card"
                className="absolute end-0 top-[34%] w-[72%] drop-shadow-[0_28px_55px_hsl(203_76%_8%/0.35)]"
              >
                <Image
                  src="/images/hero/card.webp"
                  alt=""
                  width={700}
                  height={474}
                  priority
                  className="h-auto w-full select-none"
                />
              </div>
            </div>
          </div>

          {/* Feature panel — revealed on scroll (start side) */}
          <div
            data-hero="panel"
            className="mt-10 lg:absolute lg:inset-y-0 lg:start-0 lg:mt-0 lg:flex lg:w-[46%] lg:flex-col lg:justify-center"
          >
            <span
              data-hero="panel-item"
              className="inline-flex w-fit items-center gap-2.5 rounded-full border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 px-4 py-2 font-mono text-xs font-semibold tracking-[0.14em] text-foreground/85 uppercase"
            >
              <QrCode className="size-4 text-primary" />
              {t("hero.eyebrow")}
            </span>
            <ul className="mt-6 space-y-5">
              {features.map((f) => (
                <li key={f.title} data-hero="panel-item" className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <f.icon className="size-5" />
                  </span>
                  <div>
                    <div className="text-base font-semibold text-foreground">
                      {f.title}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {f.sub}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Trust badge */}
            <div
              data-hero="trust"
              className="mt-8 flex max-w-[420px] items-center justify-between gap-4 rounded-2xl border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/images/hero/person-group.png"
                  alt=""
                  width={150}
                  height={56}
                  className="h-9 w-auto select-none"
                />
                <span className="text-sm font-medium text-foreground">
                  Trusted by 500,000+ users worldwide
                </span>
              </div>
              <div className="shrink-0 text-end">
                <div className="flex items-center justify-end gap-1 text-sm font-semibold text-foreground">
                  4.8 <Star className="size-4 fill-[#f7c948] text-[#f7c948]" />
                  <span className="text-muted-foreground">Rating</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  10,000+ reviews
                </div>
              </div>
            </div>
          </div>

          {/* Copy + CTA (end side) */}
          <div
            data-hero="copy"
            className="mt-10 lg:absolute lg:end-0 lg:top-4 lg:mt-0 lg:w-[40%]"
          >
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-muted-foreground">
              {t("hero.sub")}
            </p>
            <div
              data-hero="bottom"
              className="mt-7 flex flex-wrap gap-3"
            >
              <Button
                asChild
                className="h-11 rounded-full border border-primary/40 bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_8px_16px_-4px_hsl(var(--primary)/0.4)] transition-shadow hover:bg-primary hover:shadow-[0_10px_22px_-4px_hsl(var(--primary)/0.55)]"
              >
                <Link href="/register">{t("hero.cta1")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-primary/12 bg-linear-160 from-primary/12 to-primary/2 px-6 text-sm text-foreground hover:from-primary/20 hover:to-primary/5"
              >
                <Link href="#how">{t("hero.cta2")}</Link>
              </Button>
            </div>

            {/* Crypto transaction cards — grid: gear column + card column.
                Top card spans full width; bottom card is indented beside the gear. */}
            <div className="mt-8 grid max-w-[440px] grid-cols-[56px_1fr] items-center gap-3">
              <div data-hero="tx" className="col-span-2 row-start-1">
                {renderTx(cryptoTx[0])}
              </div>
              <span
                data-hero="tx"
                className="col-start-1 row-start-2 flex size-14 items-center justify-center justify-self-center rounded-full border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 text-muted-foreground"
              >
                <Settings className="size-5" />
              </span>
              <div data-hero="tx" className="col-start-2 row-start-2">
                {renderTx(cryptoTx[1])}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
