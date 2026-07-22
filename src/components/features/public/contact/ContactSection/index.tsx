"use client";

import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

import { gsap, ScrollTrigger, REVEAL_EASE, prefersReducedMotion } from "@/lib/gsap";

export type ContactSectionProps = Record<string, never>;

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@crypinvest.io",
    href: "mailto:hello@crypinvest.io",
  },
  {
    icon: PhoneCall,
    label: "Phone",
    value: "+1 (212) 555-0188",
    href: "tel:+12125550188",
  },
  {
    icon: MapPin,
    label: "HQ",
    value: "120 Wythe Ave",
    sub: "Brooklyn, NY 11249",
  },
] as const;

// Brand marks (lucide-react dropped its brand icons) — currentColor SVGs.
type IconProps = { className?: string; strokeWidth?: number };

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25h6.83l4.713 6.231 5.447-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

const SOCIALS = [
  { icon: XIcon, label: "X" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: LinkedInIcon, label: "LinkedIn" },
] as const;

const LABEL =
  "flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] text-primary/80 uppercase";
const FIELD =
  "w-full rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface-2)] px-5 py-4 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] placeholder:font-hero placeholder:text-muted-foreground/75 placeholder:italic focus:border-primary focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.15)] dark:border-white/10";

export function ContactSection({}: ContactSectionProps) {
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
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
      }
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="mx-auto w-full max-w-[var(--maxw)] px-7 py-[clamp(40px,7vw,80px)]"
    >
      <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start lg:gap-14">
        {/* LEFT — channels */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-28">
          {/* Book-a-call card */}
          <div
            data-reveal
            className="relative overflow-hidden rounded-[22px] border border-primary/24 bg-linear-160 from-primary/14 to-primary/2 p-8"
          >
            {/* Orbit ring — dashed circle with a glowing dot on its edge. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -end-10 -top-10 size-40 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-primary/40"
            >
              <span className="absolute -top-[5px] left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
            </span>
            <div className="relative">
              <div className={`${LABEL} mb-5`}>
                <span className="size-2 animate-pulse rounded-full bg-primary" />
                Desk online
              </div>
              <div className="font-hero text-[clamp(24px,3vw,30px)] leading-[1.15] text-foreground">
                Prefer a real conversation?
              </div>
              <a
                href="#"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/24 bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 dark:bg-[#061916]/60 dark:text-primary dark:hover:bg-[#061916]/80 dark:hover:border-primary/40"
              >
                Book a 20-min call
                <ArrowRight className="size-3.5 rtl:-scale-x-100" />
              </a>
            </div>
          </div>

          {/* Contact details */}
          <div
            data-reveal
            className="rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--surface)] p-7 dark:border-white/8 dark:bg-white/3"
          >
            {CHANNELS.map((c, i) => {
              const Icon = c.icon;
              const inner = (
                <>
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/14 text-primary">
                    <Icon className="size-4.5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <div className="text-[11px] tracking-[0.08em] text-muted-foreground/70 uppercase">
                      {c.label}
                    </div>
                    <div className="mt-0.5 font-hero text-[18px] text-foreground">
                      {c.value}
                    </div>
                    {"sub" in c && c.sub ? (
                      <div className="text-[13px] text-muted-foreground/70">
                        {c.sub}
                      </div>
                    ) : null}
                  </div>
                </>
              );
              const rowCls =
                "flex items-start gap-4" +
                (i < CHANNELS.length - 1 ? " mb-5" : "");
              return "href" in c && c.href ? (
                <a key={c.label} href={c.href} className={`group ${rowCls}`}>
                  {inner}
                </a>
              ) : (
                <div key={c.label} className={rowCls}>
                  {inner}
                </div>
              );
            })}
          </div>

          {/* Follow */}
          <div
            data-reveal
            className="flex items-center justify-between rounded-[22px] border border-[color:var(--hairline)] bg-[color:var(--surface)] px-6 py-5 dark:border-white/6 dark:bg-white/2"
          >
            <div className="text-[12px] text-muted-foreground/70">Follow</div>
            <div className="flex gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="grid size-9 place-items-center rounded-full bg-[color:var(--surface-2)] border border-[color:var(--hairline)] text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary dark:bg-white/4 dark:border-0"
                  >
                    <Icon className="size-4" strokeWidth={1.8} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT — form */}
        <form
          data-reveal
          onSubmit={(e) => e.preventDefault()}
          className="relative overflow-hidden rounded-[28px] border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8 sm:p-12 dark:border-white/10 dark:bg-linear-to-b dark:from-white/4 dark:to-white/1"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -end-20 -top-20 size-64 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.2),transparent_70%)] blur-3xl"
          />

          <div className="relative mb-8 flex items-center gap-3">
            <span className="font-hero text-[14px] text-primary italic">
              — Form
            </span>
            <span className="font-hero text-[clamp(22px,2.6vw,28px)] tracking-tight text-foreground">
              Send us a message
            </span>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={`${LABEL} mb-2.5`}>
                Full Name <span className="text-primary">*</span>
              </span>
              <input className={FIELD} placeholder="Enter Your Name…" required />
            </label>
            <label>
              <span className={`${LABEL} mb-2.5`}>
                Email <span className="text-primary">*</span>
              </span>
              <input
                className={FIELD}
                type="email"
                placeholder="Enter Your Email…"
                required
              />
            </label>
            <label>
              <span className={`${LABEL} mb-2.5`}>
                Phone <span className="text-primary">*</span>
              </span>
              <input
                className={FIELD}
                type="tel"
                placeholder="Enter Your Number…"
                required
              />
            </label>
            <label className="sm:col-span-2">
              <span className={`${LABEL} mb-2.5`}>
                Subject <span className="text-primary">*</span>
              </span>
              <input
                className={FIELD}
                placeholder="Enter Your Subject…"
                required
              />
            </label>
            <label className="sm:col-span-2">
              <span className={`${LABEL} mb-2.5`}>
                Message <span className="text-primary">*</span>
              </span>
              <textarea
                className={`${FIELD} min-h-[140px] resize-y`}
                placeholder="Enter Your Message…"
                required
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-5 sm:col-span-2">
              <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground/70">
                <ShieldCheck className="size-4 shrink-0 text-primary" strokeWidth={1.8} />
                <span>
                  End-to-end encrypted · we reply within{" "}
                  <strong className="text-foreground">4 hours</strong>
                </span>
              </div>
              <button
                type="submit"
                className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-[16px] font-semibold text-[#061916] shadow-[0_12px_32px_hsl(var(--primary)/0.3)] transition-[transform,box-shadow] hover:shadow-[0_16px_40px_hsl(var(--primary)/0.45)]"
              >
                Send Message
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
