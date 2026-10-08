"use client";

import { useState } from "react";
import {
  SendHorizontal,
  ReceiptText,
  ArrowLeftRight,
  Plus,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  LayoutGrid,
  Wallet,
  Smartphone,
  Gift,
  ChevronDown,
  Search,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/shared/DataTable";
import { AddMoneyChart } from "@/components/features/dashboard/overview/AddMoneyChart";
import { CryptoDeposits } from "@/components/features/dashboard/overview/CryptoDeposits";
import { activityColumns } from "@/components/features/dashboard/transaction/columns";
import type { Activity } from "@/components/features/dashboard/transaction/columns";
import { TransactionDetailModal } from "@/components/features/dashboard/transaction/TransactionDetailModal";

/* ─── Mock data ──────────────────────────────────────────────────────────── */

const BALANCE_ACTIONS = [
  { label: "Send",               icon: ArrowUpRight,  href: "/user/money-transfer", primary: true },
  { label: "Request",            icon: ArrowDownLeft, href: "/user/money-transfer" },
  { label: "Add money",          icon: Plus,          href: "/user/add-money" },
  { label: "Exchange",           icon: ArrowLeftRight, href: "/user/money-exchange" },
];

const CURRENCY_WALLETS = [
  { code: "EUR", name: "Euro",               symbol: "€", balance: "54,380.00", change: "+2.4%",  flag: "🇪🇺", accent: "from-indigo-500/20 to-indigo-600/5", ring: "ring-indigo-500/20" },
  { code: "USD", name: "US Dollar",          symbol: "$", balance: "12,480.50", change: "+12.4%", flag: "🇺🇸", accent: "from-blue-500/20 to-blue-600/5",   ring: "ring-blue-500/20"   },
  { code: "GBP", name: "Pound Sterling",     symbol: "£", balance: "0.00",      change: "+0.0%",  flag: "🇬🇧", accent: "from-violet-500/20 to-violet-600/5", ring: "ring-violet-500/20" },
  { code: "BDT", name: "Bangladeshi Taka",   symbol: "৳", balance: "0.00",      change: "+0.0%",  flag: "🇧🇩", accent: "from-emerald-500/20 to-emerald-600/5", ring: "ring-emerald-500/20" },
  { code: "AED", name: "UAE Dirham",         symbol: "د.إ", balance: "0.00",    change: "+0.0%",  flag: "🇦🇪", accent: "from-teal-500/20 to-teal-600/5",   ring: "ring-teal-500/20"   },
  { code: "SAR", name: "Saudi Riyal",        symbol: "﷼", balance: "0.00",      change: "+0.0%",  flag: "🇸🇦", accent: "from-green-500/20 to-green-600/5", ring: "ring-green-500/20"  },
  { code: "CAD", name: "Canadian Dollar",    symbol: "$", balance: "0.00",      change: "+0.0%",  flag: "🇨🇦", accent: "from-red-500/20 to-red-600/5",     ring: "ring-red-500/20"    },
  { code: "AUD", name: "Australian Dollar",  symbol: "$", balance: "0.00",      change: "+0.0%",  flag: "🇦🇺", accent: "from-amber-500/20 to-amber-600/5", ring: "ring-amber-500/20"  },
  { code: "SGD", name: "Singapore Dollar",   symbol: "$", balance: "0.00",      change: "+0.0%",  flag: "🇸🇬", accent: "from-pink-500/20 to-pink-600/5",   ring: "ring-pink-500/20"   },
  { code: "JPY", name: "Japanese Yen",       symbol: "¥", balance: "0.00",      change: "+0.0%",  flag: "🇯🇵", accent: "from-rose-500/20 to-rose-600/5",   ring: "ring-rose-500/20"   },
];

const VISIBLE_WALLETS = 5;

const WALLET_CARDS = [
  { label: "Total Receive Remittance", value: "0.0000 USD", icon: ArrowDownLeft,  iconBg: "bg-blue-500/10",   iconColor: "text-blue-500"   },
  { label: "Total Send Remittance",    value: "0.0000 USD", icon: SendHorizontal, iconBg: "bg-indigo-500/10", iconColor: "text-indigo-500" },
  { label: "Virtual Card",             value: "0.0000 USD", icon: CreditCard,     iconBg: "bg-teal-500/10",   iconColor: "text-teal-500"   },
  { label: "Total Bill Pay",           value: "0.0000 USD", icon: ReceiptText,    iconBg: "bg-orange-500/10", iconColor: "text-orange-500" },
  { label: "Total Mobile TopUp",       value: "0.0000 USD", icon: Smartphone,     iconBg: "bg-violet-500/10", iconColor: "text-violet-500" },
  { label: "Total Withdraw",           value: "0.0000 USD", icon: ArrowUpRight,   iconBg: "bg-emerald-500/10",iconColor: "text-emerald-500"},
  { label: "Total Transactions",       value: "24",         icon: ArrowLeftRight, iconBg: "bg-blue-500/10",   iconColor: "text-blue-500"   },
  { label: "Total Gift Cards",         value: "0",          icon: Gift,           iconBg: "bg-pink-500/10",   iconColor: "text-pink-500"   },
];

type StatCard = {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  delta?: string;
  up?: boolean;
  status?: string;
};

const STAT_CARDS: StatCard[] = [
  { label: "Total Receive Remittance", value: "8,450", unit: "USD", delta: "+12.3%", up: true,  icon: ArrowDownLeft, iconBg: "bg-indigo-500/10",  iconColor: "text-indigo-500"  },
  { label: "Total Send Remittance",    value: "5,120", unit: "USD", delta: "-3.1%",  up: false, icon: ArrowUpRight,  iconBg: "bg-rose-500/10",    iconColor: "text-rose-500"    },
  { label: "Virtual Card balance",     value: "2,340", unit: "USD", status: "Active", icon: CreditCard,   iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
];

const RECENT_ACTIVITY: Activity[] = [
  { id: "1", type: "qr",       name: "QR payment",   sub: "Coffee House",  date: "Today, 09:24",      status: "Completed", amount: -4.50   },
  { id: "2", type: "send",     name: "Transfer",      sub: "Alice Rahman",  date: "Today, 08:10",      status: "Completed", amount: -120.00 },
  { id: "3", type: "topup",    name: "Top up",        sub: "Bank Transfer", date: "Yesterday, 16:42",  status: "Completed", amount: 500.00  },
  { id: "4", type: "exchange", name: "Exchange",      sub: "EUR to USD",    date: "Yesterday, 11:30",  status: "Pending",   amount: -200.00 },
  { id: "5", type: "qr",       name: "QR payment",   sub: "Supermarket",   date: "Jun 22, 14:05",     status: "Completed", amount: -32.80  },
];

type CurrencyWallet = (typeof CURRENCY_WALLETS)[number];

/* ─── Currency picker (add-money style) ────────────────────────────────────── */

function CurrencyWalletPicker({
  value,
  onChange,
}: {
  value: CurrencyWallet;
  onChange: (w: CurrencyWallet) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = CURRENCY_WALLETS.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setSearch("");
      }}
    >
      <PopoverTrigger className="flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-xs font-semibold outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50">
        <span className="text-base leading-none">{value.flag}</span>
        {value.code}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-72 gap-0 p-0">
        <div className="px-4 pt-3 pb-2">
          <p className="text-sm font-semibold">Select currency</p>
        </div>
        <div className="px-2 pb-2">
          <div className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="scroll-thin max-h-64 overflow-y-auto rounded-b-[inherit] py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No currencies found
            </p>
          ) : (
            filtered.map((w) => {
              const active = w.code === value.code;
              return (
                <button
                  key={w.code}
                  type="button"
                  onClick={() => {
                    onChange(w);
                    setSearch("");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors hover:bg-muted",
                    active && "bg-primary/5",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg leading-none ring-1 ring-border">
                    {w.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-semibold leading-tight", active && "text-primary")}>
                      {w.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{w.code}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                    {w.symbol}{w.balance}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [currencyListOpen, setCurrencyListOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Activity | null>(null);
  const [currency, setCurrency] = useState("EUR");

  const wallet =
    CURRENCY_WALLETS.find((w) => w.code === currency) ?? CURRENCY_WALLETS[0];

  return (
    <div className="space-y-4 p-4 dapp:p-6 max-w-7xl mx-auto">

      {/* Page header */}
      <div className="space-y-0.5">
        <h2 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
          Welcome back, Daniel
        </h2>
        <p className="text-xs text-muted-foreground md:text-sm">
          Here&apos;s your money at a glance.
        </p>
      </div>

      {/* ── Hero + right sidebar ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">

        {/* Balance hero */}
        <div className="glass relative flex flex-col space-y-6 overflow-hidden rounded-2xl p-5">
          {/* bg blobs */}
          <div className="pointer-events-none absolute -top-10 end-0 size-56 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 start-1/3 size-40 rounded-full bg-primary/5 blur-2xl" />

          {/* Header: label + currency picker */}
          <div className="relative flex items-start justify-between">
            <p className="text-sm font-semibold">Total Balance</p>
            <CurrencyWalletPicker value={wallet} onChange={(w) => setCurrency(w.code)} />
          </div>

          {/* Balance */}
          <div className="relative flex flex-wrap items-end gap-x-2.5 gap-y-1">
            <p className="text-3xl font-bold tracking-tight tabular-nums">
              {wallet.symbol}
              {wallet.balance}
            </p>
            <span className="flex items-center gap-0.5 pb-1 text-xs font-semibold text-emerald-500">
              <TrendingUp className="size-3" />
              {wallet.change} this month
            </span>
          </div>

          {/* Actions */}
          <div className="relative flex flex-wrap gap-2">
            {BALANCE_ACTIONS.map(({ label, icon: Icon, href, primary }) => (
              <Link
                key={label}
                href={href as Parameters<typeof Link>[0]["href"]}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
                  primary
                    ? "bg-gradient bg-grad text-primary-foreground hover:opacity-90"
                    : "bg-muted/60 hover:bg-muted",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </Link>
            ))}
          </div>

          {/* Accounts — currency wallets */}
          <div className="relative mt-auto pt-5">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              Accounts
              <span className="text-xs font-normal text-muted-foreground">
                {CURRENCY_WALLETS.length} currencies
              </span>
            </p>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
              {CURRENCY_WALLETS.slice(0, 8).map(({ code, name, balance, symbol }, i) => {
                const isPrimary = code === wallet.code;
                const [intPart, dec] = balance.split(".");
                return (
                  <div
                    key={code}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl p-4 text-start",
                      isPrimary ? "bg-primary/10" : "bg-muted/40",
                      // below xl show only first 5 (2col × 3row); xl shows all 8 (3col × 3row)
                      i >= 5 && "hidden xl:flex",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                          {symbol}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-tight">
                            {code}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{name}</p>
                        </div>
                      </div>
                      {isPrimary && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-primary">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-bold tracking-tight tabular-nums">
                      {symbol}
                      {intPart}
                      {dec && <span>.{dec}</span>}
                    </p>
                  </div>
                );
              })}

              {/* Show more */}
              <button
                onClick={() => setCurrencyListOpen(true)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-muted/40 p-3.5 transition-colors hover:bg-muted/60"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <LayoutGrid className="size-4 text-primary" />
                </span>
                <p className="text-xs font-semibold text-muted-foreground">
                  <span className="xl:hidden">+{CURRENCY_WALLETS.length - 5}</span>
                  <span className="hidden xl:inline">+{CURRENCY_WALLETS.length - 8}</span>
                  {" "}more
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Right: wallet stat cards */}
        <div className="grid grid-cols-2 gap-3">
          {STAT_CARDS.map(({ label, value, unit, icon: Icon, iconBg, iconColor, delta, up, status }) => (
            <div key={label} className="glass rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <span className={cn("flex size-9 items-center justify-center rounded-lg", iconBg)}>
                  <Icon className={cn("size-4", iconColor)} />
                </span>
                {delta ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      up ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600",
                    )}
                  >
                    {delta}
                  </span>
                ) : status ? (
                  <span className="text-xs font-medium text-muted-foreground">{status}</span>
                ) : null}
              </div>
              <p className="mt-3 text-xl font-bold tracking-tight tabular-nums">
                ${value}
                <span className="ms-1 text-xs font-medium text-muted-foreground">{unit}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}

          {/* Show more card */}
          <button
            onClick={() => setWalletOpen(true)}
            className="glass flex flex-col items-start justify-between gap-3 rounded-2xl bg-primary/5 p-4 text-start transition-colors hover:bg-primary/10"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <LayoutGrid className="size-4 text-primary" />
            </span>
            <span>
              <span className="block text-sm font-bold">Show more</span>
              <span className="block text-xs font-medium text-primary">All widgets →</span>
            </span>
          </button>

          {/* Add money chart */}
          <AddMoneyChart className="col-span-2" />
        </div>
      </div>

      {/* Wallet Overview modal */}
      <Dialog open={walletOpen} onOpenChange={setWalletOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                <LayoutGrid className="size-3.5 text-primary" />
              </span>
              Wallet Overview
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {WALLET_CARDS.map(({ label, value, icon: Icon, iconBg, iconColor }) => {
              const [num, unit] = value.split(" ");
              return (
                <div key={label} className="rounded-2xl bg-muted/40 p-4">
                  <span className={cn("flex size-9 items-center justify-center rounded-lg", iconBg)}>
                    <Icon className={cn("size-4", iconColor)} />
                  </span>
                  <p className="mt-3 text-xl font-bold tracking-tight tabular-nums">
                    {num}
                    {unit && <span className="ms-1 text-xs font-medium text-muted-foreground">{unit}</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Currency wallet list modal */}
      <Dialog open={currencyListOpen} onOpenChange={setCurrencyListOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                <Wallet className="size-3.5 text-primary" />
              </span>
              Wallet Overview
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CURRENCY_WALLETS.map(({ code, name, balance, symbol }) => {
              const isPrimary = code === wallet.code;
              const [intPart, dec] = balance.split(".");
              return (
                <div
                  key={code}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl p-4 text-start",
                    isPrimary ? "bg-primary/10" : "bg-muted/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
                        {symbol}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold leading-tight">{code}</p>
                        <p className="truncate text-xs text-muted-foreground">{name}</p>
                      </div>
                    </div>
                    {isPrimary && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-primary">
                        PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-bold tracking-tight tabular-nums">
                    {symbol}
                    {intPart}
                    {dec && <span>.{dec}</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Recent activity + withdraw chart ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Crypto deposits */}
        <CryptoDeposits />
        {/* Recent activity */}
        <div className="glass rounded-2xl p-5">
          <DataTable
            columns={activityColumns}
            data={RECENT_ACTIVITY}
            title="Recent activity"
            extra={
              <Button size="sm" className="h-8 bg-gradient bg-grad text-xs text-primary-foreground hover:opacity-90">
                View all
              </Button>
            }
            onRowClick={setSelectedTx}
          />
        </div>

        
      </div>

      <TransactionDetailModal
        tx={selectedTx}
        open={!!selectedTx}
        onOpenChange={(open) => { if (!open) setSelectedTx(null); }}
      />
    </div>
  );
}
