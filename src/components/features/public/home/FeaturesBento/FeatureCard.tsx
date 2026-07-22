"use client";

import {
  ArrowLeftRight,
  CreditCard,
  Gift,
  Globe,
  type LucideIcon,
  QrCode,
  Send,
  Shield,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useGsapReveal } from "@/hooks/_shared/useGsapReveal";

const ICONS: Record<string, LucideIcon> = {
  wallet: Wallet,
  qr: QrCode,
  send: Send,
  card: CreditCard,
  globe: Globe,
  exchange: ArrowLeftRight,
  gift: Gift,
  shield: Shield,
};

export type FeatureCardProps = {
  /** Key into the local icon map (icons can't cross the server boundary). */
  iconKey: keyof typeof ICONS | string;
  title: string;
  description: string;
  size?: "default" | "lg" | "tall" | "wide";
  /** Position in the grid — drives the one-by-one reveal delay. */
  index?: number;
};

const SPAN: Record<NonNullable<FeatureCardProps["size"]>, string> = {
  default: "",
  lg: "sm:col-span-2",
  tall: "md:row-span-2",
  wide: "sm:col-span-2",
};

export function FeatureCard({
  iconKey,
  title,
  description,
  size = "default",
  index = 0,
}: FeatureCardProps) {
  const Icon = ICONS[iconKey] ?? Wallet;
  const ref = useGsapReveal<HTMLDivElement>({ y: 24, delay: index * 0.08 });

  return (
    <div
      ref={ref}
      className={cn(
        "glass flex flex-col gap-3 p-6.5 transition-all duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:border-[color:var(--hairline-strong)] hover:shadow-lift  ",
        SPAN[size],
      )}
    >
      <span className="grid size-12 place-items-center rounded-[14px] border border-[color:var(--hairline)] bg-[color:var(--surface-2)] text-primary">
        <Icon className="size-6" />
      </span>
      <h3
        className={cn(
          "font-heading font-semibold",
          size === "lg" ? "text-2xl" : "text-[19px]",
        )}
      >
        {title}
      </h3>
      <p className="text-[14.5px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
