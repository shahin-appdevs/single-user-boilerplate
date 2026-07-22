"use client";

import { Check, ScanLine, Smartphone, type LucideIcon } from "lucide-react";

import { useGsapReveal } from "@/hooks/_shared/useGsapReveal";

const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  scan: ScanLine,
  check: Check,
};

export type StepCardProps = {
  number: string;
  /** Key into the local icon map (icons can't cross the server boundary). */
  iconKey: keyof typeof ICONS | string;
  title: string;
  description: string;
  /** Position in the row — drives the one-by-one reveal delay. */
  index?: number;
};

export function StepCard({
  number,
  iconKey,
  title,
  description,
  index = 0,
}: StepCardProps) {
  const Icon = ICONS[iconKey] ?? Smartphone;
  const ref = useGsapReveal<HTMLDivElement>({ y: 24, delay: index * 0.12 });

  return (
    <div
      ref={ref}
      className="glass relative p-7.5 transition-all duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:border-[color:var(--hairline-strong)] hover:shadow-lift"
    >
      <span className="font-heading absolute end-7.5 top-7.5 text-[32px] leading-none font-extrabold text-neutral-300 dark:text-white/15">
        {number}
      </span>
      <span className="mb-4 grid size-[54px] place-items-center rounded-2xl bg-[image:var(--gradient)] text-white shadow-[0_12px_28px_-12px_var(--glow)]">
        <Icon className="size-[26px]" />
      </span>
      <h3 className="font-heading mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-[14.5px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
