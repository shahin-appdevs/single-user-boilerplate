"use client";

import { Cpu, QrCode, Wifi } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VCard } from "./types";

/** The dark virtual-card visual. `compact` renders the small wallet thumbnail. */
export function VirtualCardView({
  card,
  compact = false,
  className,
}: {
  card: VCard;
  compact?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <div
        className={cn(
          "flex aspect-[1.6/1] w-40 shrink-0 flex-col justify-between rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 p-3 text-white ring-1 ring-white/10",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-wide">CrypInvest</span>
          <QrCode className="size-4 opacity-70" />
        </div>
        <span dir="ltr" className="text-xs font-medium tabular-nums tracking-widest">
          •••• {card.last4}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-5 text-white shadow-lg ring-1 ring-white/10",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold tracking-wide">CrypInvest</span>
        <QrCode className="size-9 opacity-90" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Cpu className="size-7 text-amber-300/80" />
        <Wifi className="size-5 -rotate-90 opacity-80" />
      </div>

      <div dir="ltr" className="mt-4 flex items-center gap-3 text-lg font-semibold tracking-[0.2em] tabular-nums">
        <span>{card.bin}</span>
        <span className="opacity-70">00**</span>
        <span className="opacity-70">****</span>
        <span>{card.last4}</span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-wide text-white/60">Exp. End</p>
          <p dir="ltr" className="text-sm font-medium tabular-nums">{card.exp}</p>
        </div>
      </div>

      <p className="mt-2 text-xs font-semibold uppercase tracking-wide">{card.holder}</p>
    </div>
  );
}
