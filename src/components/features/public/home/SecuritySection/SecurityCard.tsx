"use client";

import {
  BookOpen,
  Eye,
  Fingerprint,
  KeyRound,
  Lock,
  type LucideIcon,
  Users,
} from "lucide-react";

import { useGsapReveal } from "@/hooks/_shared/useGsapReveal";

const ICONS: Record<string, LucideIcon> = {
  key: KeyRound,
  fingerprint: Fingerprint,
  lock: Lock,
  users: Users,
  eye: Eye,
  book: BookOpen,
};

export type SecurityCardProps = {
  /** Key into the local icon map (icons can't cross the server boundary). */
  iconKey: keyof typeof ICONS | string;
  title: string;
  description: string;
  /** Position in the grid — drives the one-by-one reveal delay. */
  index?: number;
};

export function SecurityCard({
  iconKey,
  title,
  description,
  index = 0,
}: SecurityCardProps) {
  const Icon = ICONS[iconKey] ?? KeyRound;
  const ref = useGsapReveal<HTMLDivElement>({ y: 24, delay: index * 0.08 });

  return (
    <div
      ref={ref}
      className="glass flex gap-4 p-5.5 transition-all duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:border-[color:var(--hairline-strong)] hover:shadow-lift"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-[13px] border border-[color:var(--hairline)] bg-[color:var(--surface-2)] text-primary">
        <Icon className="size-[22px]" />
      </span>
      <span>
        <h3 className="font-heading mb-1.5 text-base font-semibold">{title}</h3>
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </span>
    </div>
  );
}
