"use client";

import { QrCode } from "lucide-react";

import { useGsapReveal } from "@/hooks/_shared/useGsapReveal";

const EYEBROW =
  "inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold uppercase tracking-[0.18em] text-primary rtl:tracking-[0.04em]";

export type SecurityIntroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  badges: string[];
};

/** Sticky left column of the security section — revealed one-by-one. */
export function SecurityIntro({
  eyebrow,
  title,
  lead,
  badges,
}: SecurityIntroProps) {
  const ref = useGsapReveal<HTMLDivElement>({
    stagger: 0.12,
    delay: 0.05,
    duration: 0.6,
    amount: 0.5,
    repeat: true,
  });

  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 lg:sticky lg:top-[100px]"
    >
      <span className={EYEBROW}>
        <QrCode className="size-4" />
        {eyebrow}
      </span>
      <h2 className="font-heading text-[clamp(30px,4.2vw,52px)] font-bold tracking-tight text-balance">
        {title}
      </h2>
      <p className="max-w-[42ch] text-[clamp(16px,1.6vw,19px)] text-muted-foreground">
        {lead}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-2.5">
        {badges.map((b) => (
          <span
            key={b}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface-2)] px-3.5 py-1.5 text-[13.5px] text-muted-foreground"
          >
            <span className="size-[7px] rounded-full bg-[image:var(--gradient)] shadow-[0_0_10px_var(--glow)]" />
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
