"use client";

import { Bitcoin, Settings, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────────────────────── */

type CryptoDeposit = {
  id: string;
  coin: string;
  code: string;
  Icon: LucideIcon;
  iconBg: string;
  amount: string;
  /** Wallet address (short) or null while awaiting the deposit. */
  address: string | null;
  fiat: string;
};

/* ── Mock data ───────────────────────────────────────────────────────────── */

const DEPOSITS: CryptoDeposit[] = [
  {
    id: "1",
    coin: "Bitcoin",
    code: "BTC",
    Icon: Bitcoin,
    iconBg: "bg-[#f7931a]",
    amount: "+0.2356 BTC",
    address: "bc1q...x7Bujk",
    fiat: "€432.49",
  },
  {
    id: "2",
    coin: "Bitcoin",
    code: "BTC",
    Icon: Bitcoin,
    iconBg: "bg-emerald-500",
    amount: "+0.2356 BTC",
    address: null,
    fiat: "€432.49",
  },
];

/* ── Row ─────────────────────────────────────────────────────────────────── */

function DepositRow({ d }: { d: CryptoDeposit }) {
  const { Icon } = d;
  return (
    <div className="flex items-center gap-3 rounded-xl bg-emerald-950/40 p-3 ring-1 ring-emerald-500/15">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-white",
          d.iconBg,
        )}
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-emerald-50">
          {d.coin} <span className="text-emerald-200/60">({d.code})</span>
        </p>
        <p className="truncate text-xs text-emerald-200/70">
          {d.address ?? "Waiting for deposit"}
        </p>
      </div>

      <div className="text-end">
        <p className="text-sm font-semibold text-emerald-400">{d.amount}</p>
        <p className="text-xs text-emerald-200/70">{d.fiat}</p>
      </div>
    </div>
  );
}

/* ── List card ───────────────────────────────────────────────────────────── */

export function CryptoDeposits({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-emerald-900/80 to-emerald-950/90 p-4 ring-1 ring-emerald-500/20",
        className,
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-semibold text-emerald-50">Crypto deposits</p>
        <button
          type="button"
          aria-label="Deposit settings"
          className="flex size-8 items-center justify-center rounded-full bg-emerald-950/50 text-emerald-200/80 ring-1 ring-emerald-500/15 transition-colors hover:text-emerald-50"
        >
          <Settings className="size-4" />
        </button>
      </div>

      {DEPOSITS.map((d) => (
        <DepositRow key={d.id} d={d} />
      ))}
    </div>
  );
}
