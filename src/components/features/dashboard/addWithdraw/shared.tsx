"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, CheckCircle2, ChevronDown, ChevronRight, Clock, CreditCard, Search, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ─── Types & data ───────────────────────────────────────────────────────── */

export type Currency = { code: string; name: string; flag: string; symbol: string; rate: number };
export type Wallet = Currency & { balance: number };

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar",         flag: "🇺🇸", symbol: "$",   rate: 1.00   },
  { code: "EUR", name: "Euro",              flag: "🇪🇺", symbol: "€",   rate: 0.94   },
  { code: "GBP", name: "British Pound",     flag: "🇬🇧", symbol: "£",   rate: 0.79   },
  { code: "BDT", name: "Bangladeshi Taka",  flag: "🇧🇩", symbol: "৳",   rate: 110.5  },
  { code: "AED", name: "UAE Dirham",        flag: "🇦🇪", symbol: "د.إ", rate: 3.67   },
  { code: "SAR", name: "Saudi Riyal",       flag: "🇸🇦", symbol: "ر.س", rate: 3.75   },
  { code: "CAD", name: "Canadian Dollar",   flag: "🇨🇦", symbol: "CA$", rate: 1.35   },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$",  rate: 1.53   },
];

export const WALLETS: Wallet[] = [
  { code: "USD", name: "US Dollar",        flag: "🇺🇸", symbol: "$",   rate: 1.00,  balance: 12480.50 },
  { code: "EUR", name: "Euro",             flag: "🇪🇺", symbol: "€",   rate: 0.94,  balance: 0.00     },
  { code: "GBP", name: "British Pound",    flag: "🇬🇧", symbol: "£",   rate: 0.79,  balance: 0.00     },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩", symbol: "৳",   rate: 110.5, balance: 0.00     },
  { code: "AED", name: "UAE Dirham",       flag: "🇦🇪", symbol: "د.إ", rate: 3.67,  balance: 0.00     },
  { code: "SAR", name: "Saudi Riyal",      flag: "🇸🇦", symbol: "ر.س", rate: 3.75,  balance: 0.00     },
];

export type BalanceKind = "spendable" | "investment";
export type Balance = {
  kind: BalanceKind;
  code: string;
  symbol: string;
  rate: number;
  balance: number;
};

export const BALANCES: Balance[] = [
  { kind: "spendable",  code: "USD", symbol: "$", rate: 1, balance: 24819.42 },
  { kind: "investment", code: "USD", symbol: "$", rate: 1, balance: 7385.26  },
];

export type GatewayCategory = "cards" | "wallets" | "bank" | "crypto" | "mobile";

export type Gateway = {
  value: string;
  label: string;
  subtitle: string;
  category: GatewayCategory;
  icon: string;
  iconBg: string;
  speed: string;
  fee: string;
};

export const GATEWAY_CATEGORIES: { key: "all" | GatewayCategory; label: string }[] = [
  { key: "all",     label: "All" },
  { key: "cards",   label: "Cards" },
  { key: "wallets", label: "Wallets" },
  { key: "bank",    label: "Bank" },
  { key: "crypto",  label: "Crypto" },
  { key: "mobile",  label: "Mobile" },
];

export const ADD_GATEWAYS: Gateway[] = [
  { value: "stripe",       label: "Stripe",       subtitle: "Visa · MC · Amex",        category: "cards",   icon: "💳", iconBg: "bg-indigo-500",  speed: "Instant",   fee: "2.9% + $0.30" },
  { value: "paypal",       label: "PayPal",       subtitle: "Balance · linked bank",   category: "wallets", icon: "🅿️", iconBg: "bg-blue-600",    speed: "Instant",   fee: "3.49%"        },
  { value: "bank-wire",    label: "Bank wire",    subtitle: "ACH · SEPA · SWIFT",      category: "bank",    icon: "🏦", iconBg: "bg-emerald-800", speed: "1–3 days",  fee: "Free"         },
  { value: "apple-pay",    label: "Apple Pay",    subtitle: "Face ID · Touch ID",      category: "wallets", icon: "",  iconBg: "bg-neutral-900", speed: "Instant",   fee: "1.5%"         },
  { value: "google-pay",   label: "Google Pay",   subtitle: "One-tap checkout",        category: "wallets", icon: "G", iconBg: "bg-white ring-1 ring-border text-foreground", speed: "Instant", fee: "1.5%" },
  { value: "crypto",       label: "Crypto",       subtitle: "BTC · ETH · USDC · +11",  category: "crypto",  icon: "₿", iconBg: "bg-amber-500",   speed: "~8 sec",    fee: "Free"         },
  { value: "wise",         label: "Wise",         subtitle: "Multi-currency · low FX", category: "bank",    icon: "W", iconBg: "bg-slate-800",   speed: "1–2 days",  fee: "0.4%"         },
  { value: "revolut",      label: "Revolut",      subtitle: "Card · balance",          category: "wallets", icon: "R", iconBg: "bg-blue-700",    speed: "Instant",   fee: "1.5%"         },
  { value: "klarna",       label: "Klarna",       subtitle: "Pay in 4",                category: "wallets", icon: "K", iconBg: "bg-pink-400",    speed: "Instant",   fee: "2.9%"         },
  { value: "mobile-money", label: "Mobile Money", subtitle: "bKash · Nagad · M-Pesa",  category: "mobile",  icon: "📱", iconBg: "bg-teal-600",   speed: "Instant",   fee: "1.0%"         },
];

export const WITHDRAW_METHODS = [
  { value: "bank-transfer",  label: "Bank Transfer",  icon: "🏦" },
  { value: "wire-transfer",  label: "Wire Transfer",  icon: "🔁" },
  { value: "mobile-banking", label: "Mobile Banking", icon: "📱" },
];

export const ADD_FIXED_CHARGE   = 1.0;
export const ADD_PERCENT_CHARGE = 1.5;
export const WD_FIXED_CHARGE    = 2.0;
export const WD_PERCENT_CHARGE  = 2.0;

export const ADD_MIN_USD = 10;
export const ADD_MAX_USD = 5000;
export const ADD_DAILY_REMAINING_USD = 10000;
export const WD_MIN_USD = 10;
export const WD_MAX_USD = 3000;
export const WD_DAILY_REMAINING_USD = 5000;

export const ADD_LIMITS = [
  { key: "minAmount",        value: "10.0000 USD"     },
  { key: "maxAmount",        value: "5,000.0000 USD"  },
  { key: "dailyLimit",       value: "10,000.0000 USD" },
  { key: "remainingDaily",   value: "10,000.0000 USD" },
  { key: "monthlyLimit",     value: "50,000.0000 USD" },
  { key: "remainingMonthly", value: "50,000.0000 USD" },
] as const;

export const WD_LIMITS = [
  { key: "minAmount",        value: "10.0000 USD"     },
  { key: "maxAmount",        value: "3,000.0000 USD"  },
  { key: "dailyLimit",       value: "5,000.0000 USD"  },
  { key: "remainingDaily",   value: "5,000.0000 USD"  },
  { key: "monthlyLimit",     value: "30,000.0000 USD" },
  { key: "remainingMonthly", value: "30,000.0000 USD" },
] as const;

type LimitKey =
  | "minAmount"
  | "maxAmount"
  | "dailyLimit"
  | "remainingDaily"
  | "monthlyLimit"
  | "remainingMonthly";
type LimitRow = { key: LimitKey; value: string };

/* ─── Primitives ─────────────────────────────────────────────────────────── */

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs tracking-wide text-muted-foreground md:text-sm">{children}</p>;
}

export function GatewayPicker({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Fired right after a row/card is picked — use to auto-advance to the next step. */
  onSelect?: () => void;
}) {
  const t = useTranslations("addWithdraw");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | GatewayCategory>("all");

  const filtered = useMemo(
    () =>
      ADD_GATEWAYS.filter(
        (g) =>
          (category === "all" || g.category === category) &&
          (g.label.toLowerCase().includes(search.toLowerCase()) ||
            g.subtitle.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, category],
  );

  return (
    <div>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3.5 py-3">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("searchGateways", { count: ADD_GATEWAYS.length })}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {GATEWAY_CATEGORIES.map((c) => {
          const active = category === c.key;
          const count = c.key === "all" ? ADD_GATEWAYS.length : ADD_GATEWAYS.filter((g) => g.category === c.key).length;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
                active
                  ? "border-transparent [background:var(--gradient)] text-white"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {c.label}
              {c.key === "all" && <span className="opacity-80">· {count}</span>}
            </button>
          );
        })}
      </div>

      {/* Compact row list — small screens */}
      <div className="mt-4 space-y-2 sm:hidden">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("noGateways")}</p>
        ) : (
          filtered.map((g) => {
            const active = g.value === value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => {
                  onChange(g.value);
                  onSelect?.();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-start transition-colors",
                  active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40",
                )}
              >
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg text-base", g.iconBg)}>
                  {g.icon}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">{g.label}</span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" />
              </button>
            );
          })
        )}
      </div>

      {/* Card grid — sm and up */}
      <div className="mt-4 hidden gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full py-8 text-center text-sm text-muted-foreground">{t("noGateways")}</p>
        ) : (
          filtered.map((g) => {
            const active = g.value === value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => onChange(g.value)}
                className={cn(
                  "relative flex flex-col gap-3 rounded-2xl border p-4 text-start transition-colors",
                  active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "absolute end-3 top-3 flex size-5 items-center justify-center rounded-full border",
                    active ? "border-primary bg-primary text-white" : "border-border bg-card",
                  )}
                >
                  {active && <Check className="size-3" strokeWidth={3} />}
                </span>

                <span className={cn("flex size-11 items-center justify-center rounded-xl text-lg", g.iconBg)}>
                  {g.icon}
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight text-foreground">{g.label}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{g.subtitle}</p>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground">{g.speed}</span>
                  <span className="font-medium text-primary">{g.fee}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

/** Balance-type selector — two cards (Spendable / Investment) matching the
    withdraw design. Investment uses an amber accent, Spendable the brand tint. */
export function BalanceTypePicker({
  value,
  onChange,
  onSelect,
}: {
  value: BalanceKind;
  onChange: (b: Balance) => void;
  onSelect?: () => void;
}) {
  const t = useTranslations("addWithdraw");

  const CARDS = [
    {
      kind: "spendable" as const,
      Icon: CreditCard,
      title: t("balanceSpendable"),
      sub: t("balanceSpendableSub"),
      foot: t("balanceSpendableFoot"),
      tag: t("balanceSpendableTag"),
      TagIcon: Check,
      accent: "text-primary",
      centAccent: "text-primary",
      iconBg: "bg-primary/15 text-primary",
    },
    {
      kind: "investment" as const,
      Icon: TrendingUp,
      title: t("balanceInvestment"),
      sub: t("balanceInvestmentSub"),
      foot: t("balanceInvestmentFoot"),
      tag: t("balanceInvestmentTag"),
      TagIcon: Clock,
      accent: "text-amber-500",
      centAccent: "text-amber-500",
      iconBg: "bg-amber-500/15 text-amber-500",
    },
  ];

  return (
    <div dir="ltr" className="grid gap-4 sm:grid-cols-2">
      {CARDS.map((c) => {
        const bal = BALANCES.find((b) => b.kind === c.kind)!;
        const active = value === c.kind;
        const [intPart, centPart] = bal.balance
          .toLocaleString("en-US", { minimumFractionDigits: 2 })
          .split(".");
        return (
          <button
            key={c.kind}
            type="button"
            onClick={() => { onChange(bal); onSelect?.(); }}
            className={cn(
              "relative flex flex-col gap-4 rounded-2xl border p-5 text-start transition-colors",
              active
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/40",
            )}
          >
            <span
              className={cn(
                "absolute end-4 top-4 flex size-5 items-center justify-center rounded-full border",
                active ? "border-primary bg-primary text-white" : "border-border bg-card",
              )}
            >
              {active && <Check className="size-3" strokeWidth={3} />}
            </span>

            <div className="flex items-center gap-3">
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", c.iconBg)}>
                <c.Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-hero text-lg font-bold leading-tight text-foreground">{c.title}</p>
                <p className="truncate text-xs text-muted-foreground">{c.sub}</p>
              </div>
            </div>

            <div className="font-hero text-[clamp(28px,4vw,40px)] leading-none font-bold tabular-nums text-foreground">
              {bal.symbol}{intPart}
              <span className={c.centAccent}>.{centPart}</span>
            </div>

            <div className="border-t border-border pt-3.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">{c.foot}</span>
                <span className={cn("inline-flex items-center gap-1 font-semibold uppercase", c.accent)}>
                  <c.TagIcon className="size-3.5" />
                  {c.tag}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function TextField({
  label, placeholder, value, onChange, type = "text", dir, invalid = false,
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; dir?: "ltr" | "rtl"; invalid?: boolean;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        dir={dir}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "flex h-11 w-full rounded-lg bg-muted/40 px-3 text-xs outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 md:text-sm",
          invalid && "ring-2 ring-destructive",
        )}
      />
    </div>
  );
}

function CurrencyPicker({ value, onChange }: { value: Currency; onChange: (c: Currency) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("addWithdraw");

  const filtered = CURRENCIES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <span className="text-base leading-none">{value.flag}</span>
        <span>{value.code}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-64 gap-0 p-0">
        <div className="px-4 pt-3 pb-2"><p className="text-sm font-semibold">{t("selectCurrency")}</p></div>
        <div className="px-2 pb-2">
          <div className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input autoFocus type="text" placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
        </div>
        <div className="scroll-thin max-h-60 overflow-y-auto rounded-b-[inherit] py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">{t("noCurrencies")}</p>
          ) : (
            filtered.map((c) => {
              const active = c.code === value.code;
              return (
                <button key={c.code} type="button" onClick={() => { onChange(c); setSearch(""); setOpen(false); }}
                  className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors hover:bg-muted", active && "bg-primary/5")}>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg leading-none ring-1 ring-border">{c.flag}</span>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold leading-tight", active && "text-primary")}>{c.name}</p>
                    <p className="text-xs text-muted-foreground">1 USD = {c.rate.toFixed(4)} {c.code}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function WalletPicker({ value, onChange }: { value: Wallet; onChange: (w: Wallet) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("addWithdraw");

  const filtered = WALLETS.filter(
    (w) => w.name.toLowerCase().includes(search.toLowerCase()) || w.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <FieldLabel>{t("fromWallet")}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex h-11 w-full items-center gap-3 rounded-lg bg-muted/40 px-3 text-start transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="text-xl leading-none">{value.flag}</span>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{value.name}</p></div>
          <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
            {value.symbol}{value.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-72 gap-0 p-0">
          <div className="px-4 pt-3 pb-2"><p className="text-sm font-semibold">{t("selectWallet")}</p></div>
          <div className="px-2 pb-2">
            <div className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5">
              <Search className="size-3.5 shrink-0 text-muted-foreground" />
              <input autoFocus type="text" placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="scroll-thin max-h-64 overflow-y-auto rounded-b-[inherit] py-1">
            {filtered.map((w) => {
              const active = w.code === value.code;
              return (
                <button key={w.code} type="button" onClick={() => { onChange(w); setSearch(""); setOpen(false); }}
                  className={cn("flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors hover:bg-muted", active && "bg-primary/5")}>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xl leading-none ring-1 ring-border">{w.flag}</span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-semibold leading-tight", active && "text-primary")}>{w.name}</p>
                    <p className="text-xs text-muted-foreground">{w.code}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">{w.symbol}{w.balance.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function AmountInput({
  label, value, onChange, currency, onCurrencyChange, readOnly = false, invalid = false,
}: {
  label: string; value: string; onChange?: (v: string) => void; currency: Currency;
  onCurrencyChange: (c: Currency) => void; readOnly?: boolean; invalid?: boolean;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div dir="ltr" className={cn("flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 transition-colors", !readOnly && "focus-within:ring-3 focus-within:ring-ring/50", invalid && "ring-2 ring-destructive")}>
        <span className="shrink-0 select-none text-sm font-semibold text-muted-foreground">{currency.symbol}</span>
        <input type="number" min="0" step="0.01" placeholder="0.00" readOnly={readOnly} value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          onWheel={(e) => e.currentTarget.blur()}
          className="min-w-0 flex-1 bg-transparent text-base font-semibold tabular-nums text-foreground outline-none placeholder:text-muted-foreground read-only:cursor-default" />
        <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
        <CurrencyPicker value={currency} onChange={onCurrencyChange} />
      </div>
    </div>
  );
}

export function BigAmountField({
  label, value, onChange, currency, onCurrencyChange, subtext, readOnly = false, accent = false, invalid = false,
}: {
  label: string; value: string; onChange?: (v: string) => void; currency: Currency;
  onCurrencyChange: (c: Currency) => void; subtext?: string; readOnly?: boolean; accent?: boolean; invalid?: boolean;
}) {
  return (
    <div dir="ltr">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase">{label}</span>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold shadow-sm",
            invalid && "border-destructive",
          )}
        >
          <CurrencyPicker value={currency} onChange={onCurrencyChange} />
        </span>
      </div>
      <div className="relative flex h-[clamp(48px,8vw,72px)] items-center">
        <span
          className={cn(
            "pointer-events-none absolute start-1 top-1/2 -translate-y-1/2 font-hero text-[clamp(24px,4vw,34px)] font-bold",
            accent ? "text-primary/40" : "text-muted-foreground/40",
          )}
        >
          {currency.symbol}
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="0"
          readOnly={readOnly}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          onWheel={(e) => e.currentTarget.blur()}
          className={cn(
            "w-full bg-transparent text-center font-hero text-[clamp(40px,7vw,64px)] leading-none font-bold tracking-tight outline-none tabular-nums placeholder:text-muted-foreground/30 read-only:cursor-default",
            accent ? "text-primary" : "text-foreground",
          )}
        />
      </div>
      <div className="mt-2 min-h-[18px] text-center text-[13px] text-muted-foreground">{subtext}</div>
    </div>
  );
}

export function PreviewRows({ rows }: { rows: { label: string; value: string; highlight?: boolean }[] }) {
  return (
    <div className="space-y-2">
      {rows.map(({ label, value, highlight }) => (
        <div key={label} className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 px-3 py-2.5">
          <span className={cn("shrink-0 text-xs text-muted-foreground md:text-sm", highlight && "font-semibold text-foreground")}>{label}</span>
          <span className={cn("text-end text-xs font-medium tabular-nums md:text-sm", highlight && "font-semibold text-primary")}>{value}</span>
        </div>
      ))}
    </div>
  );
}

export function SuccessView({
  title, detail, rows, onReset, resetLabel,
}: {
  title: string; detail: string; rows: { label: string; value: string; highlight?: boolean }[];
  onReset: () => void; resetLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="size-9 text-emerald-500" />
      </span>
      <div className="space-y-1">
        <p className="text-lg font-bold">{title}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
      <div className="w-full space-y-2 pt-2">
        {rows.map(({ label, value, highlight }) => (
          <div key={label} className="flex items-center justify-between px-3 py-2.5">
            <span className="text-xs text-muted-foreground md:text-sm">{label}</span>
            <span className={cn("text-xs font-semibold tabular-nums md:text-sm", highlight && "text-primary")}>{value}</span>
          </div>
        ))}
      </div>
      <Button size="lg" className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90" onClick={onReset}>
        {resetLabel}
      </Button>
    </div>
  );
}

export function LimitPanel({ limits }: { limits: ReadonlyArray<LimitRow> }) {
  const t = useTranslations("addWithdraw");
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
      <div className="mb-5">
        <p className="font-hero text-xl font-bold text-foreground">{t("limitationsTitle")}</p>
      </div>
      <div className="space-y-2">
        {limits.map(({ key, value }, i) => {
          const isLast = i === limits.length - 1;
          return (
            <div
              key={key}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl px-4 py-3",
                isLast && "bg-primary/8",
              )}
            >
              <span className={cn("text-[13px] text-muted-foreground", isLast && "font-semibold text-primary")}>
                {t(`limits.${key}`)}
              </span>
              <span className={cn("text-[13px] font-medium text-foreground", isLast && "text-sm font-semibold text-primary")}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
