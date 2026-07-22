"use client";

import { QrCode } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGsapReveal } from "@/hooks/_shared/useGsapReveal";

export type SectionHeadProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Stack centered (default) or start-aligned for sticky side heads. */
  align?: "center" | "start";
  className?: string;
};

const EYEBROW =
  "inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold uppercase tracking-[0.18em] text-primary rtl:tracking-[0.04em]";

/** Eyebrow + heading + optional lead — revealed one-by-one on scroll. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: SectionHeadProps) {
  const ref = useGsapReveal<HTMLDivElement>({
    stagger: 0.12,
    delay: 0.05,
    duration: 0.6,
    amount: 0.4,
    repeat: true,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <span className={EYEBROW}>
        <QrCode className="size-4" />
        {eyebrow}
      </span>
      <h2 className="font-heading text-[clamp(30px,4.2vw,52px)] font-bold tracking-tight text-balance">
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "max-w-[56ch] text-[clamp(16px,1.6vw,19px)] text-muted-foreground",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
