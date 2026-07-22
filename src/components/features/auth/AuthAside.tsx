"use client";

import Image from "next/image";
import { QrCode } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROLE_META } from "./roleConfig";

// Left brand panel. Hidden below 880px. Dark gradient with an orbiting ring,
// grid overlay, serif headline, feature grid and trust row — matches Auth.dc.
export function AuthAside() {
  const role = useAuthStore((s) => s.role);
  const meta = ROLE_META[role];

  // Split the headline so the accent word renders in italic primary.
  const [before, after] = meta.headline.split(meta.headlineAccent);

  return (
    <aside
      className="relative hidden flex-col justify-between overflow-hidden p-11 text-white min-[880px]:flex"
      style={{
        backgroundImage:
          "radial-gradient(600px 400px at 20% 10%, color-mix(in srgb, var(--grad-from) 35%, transparent), transparent 60%), radial-gradient(500px 400px at 90% 90%, color-mix(in srgb, var(--grad-from) 20%, transparent), transparent 60%), linear-gradient(160deg, #0A2A22 0%, #061916 55%, #04120F 100%)",
      }}
    >
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(1000px 700px at 50% 50%, black, transparent 90%)",
        }}
      />

      {/* Orbiting ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute end-[-100px] top-[40%] size-80 animate-[spin_30s_linear_infinite] rounded-full border border-dashed border-[hsl(var(--primary)/0.3)]"
      >
        <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary))]" />
      </div>

      {/* Logo */}
      <Link href="/" aria-label="CrypInvest" className="relative z-10 inline-flex">
        <Image
          src="/images/logo/logo-dark.webp"
          alt="CrypInvest"
          width={130}
          height={32}
          priority
          style={{ height: 32, width: "auto" }}
        />
      </Link>

      {/* Middle */}
      <div className="relative z-10 animate-[fade-in-up_0.8s_cubic-bezier(.2,.7,.2,1)_both]">
        <span className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-primary/90 uppercase">
          <QrCode className="size-3" />
          {meta.eyebrow}
        </span>

        <h2 className="max-w-[12ch] font-hero text-[clamp(44px,5vw,68px)] leading-[1.02] font-bold tracking-tight text-[#F1FAF5]">
          {before}
          <em className="text-primary not-italic">
            <span className="italic">{meta.headlineAccent}</span>
          </em>
          {after}
        </h2>

        <p className="mt-6 mb-10 max-w-[46ch] text-[17px] leading-relaxed text-[#A8BEB6]">
          {meta.lead}
        </p>

        <div className="grid max-w-[480px] grid-cols-2 gap-x-6 gap-y-1">
          {meta.features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3.5 py-3.5">
              <i className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/12 backdrop-blur">
                <Icon className="size-4.5 text-primary" strokeWidth={1.8} />
              </i>
              <span className="text-[14px] text-[#E6F1EC]">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust row */}
      <div className="relative z-10 flex items-center gap-3.5 text-[13px] text-[#A8BEB6]">
        <div className="flex">
          <span className="size-7 rounded-full border-2 border-[#061916] bg-primary" />
          <span className="-ms-2 size-7 rounded-full border-2 border-[#061916] bg-[#B4E8D4]" />
          <span className="-ms-2 size-7 rounded-full border-2 border-[#061916] bg-[#F0D8A8]" />
          <span className="-ms-2 grid size-7 place-items-center rounded-full border-2 border-[#061916] bg-white/6 text-[11px] text-[#E6F1EC]">
            +
          </span>
        </div>
        <div>
          Join <strong className="text-[#F1FAF5]">148,000+</strong> investors
          already on-chain.
        </div>
      </div>
    </aside>
  );
}
