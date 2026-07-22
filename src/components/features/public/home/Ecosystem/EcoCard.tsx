"use client";

import {
  CreditCard,
  Fingerprint,
  Globe,
  type LucideIcon,
  MessageSquare,
} from "lucide-react";

import { useGsapReveal } from "@/hooks/_shared/useGsapReveal";

const ICONS: Record<string, LucideIcon> = {
  card: CreditCard,
  globe: Globe,
  message: MessageSquare,
  identity: Fingerprint,
};

export type EcoCardProps = {
  /** Key into the local icon map (icons can't cross the server boundary). */
  iconKey: keyof typeof ICONS | string;
  title: string;
  /** Integration logo chips (brand names, kept LTR). */
  chips: string[];
  /** Position in the row — drives the one-by-one reveal delay. */
  index?: number;
};

export function EcoCard({ iconKey, title, chips, index = 0 }: EcoCardProps) {
  const Icon = ICONS[iconKey] ?? CreditCard;
  const cardRef = useGsapReveal<HTMLDivElement>({ y: 24, delay: index * 0.1 });
  const chipsRef = useGsapReveal<HTMLDivElement>({
    x: 24,
    y: 0,
    stagger: 0.08,
    delay: 0.15,
    duration: 0.4,
    amount: 0.6,
  });

  return (
    <div
      ref={cardRef}
      className="glass flex flex-col gap-3.5 p-6 transition-all duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:border-[color:var(--hairline-strong)] hover:shadow-lift"
    >
      <span className="grid size-11 place-items-center rounded-[13px] border border-[color:var(--hairline)] bg-[color:var(--surface-2)] text-primary">
        <Icon className="size-[22px]" />
      </span>
      <h3 className="font-heading text-[16.5px] font-semibold">{title}</h3>
      <div ref={chipsRef} className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span
            key={c}
            dir="ltr"
            className="rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface-2)] px-2.5 py-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
