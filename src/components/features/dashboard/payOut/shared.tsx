"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ─── Shared types ───────────────────────────────────────────────────────── */

export type Currency = {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  /** Units per 1 USD. */
  rate: number;
};

export type Wallet = Currency & { balance: number };

/* ─── Shared reference data ──────────────────────────────────────────────── */

export const WALLETS: Wallet[] = [
  { code: "USD", name: "United States Dollar", flag: "🇺🇸", symbol: "$",   rate: 1.00,  balance: 979.66 },
  { code: "EUR", name: "Euro",                 flag: "🇪🇺", symbol: "€",   rate: 0.94,  balance: 320.40 },
  { code: "GBP", name: "British Pound",        flag: "🇬🇧", symbol: "£",   rate: 0.79,  balance: 150.00 },
  { code: "BDT", name: "Bangladeshi Taka",     flag: "🇧🇩", symbol: "৳",   rate: 110.5, balance: 0.00   },
  { code: "AED", name: "UAE Dirham",           flag: "🇦🇪", symbol: "د.إ", rate: 3.67,  balance: 0.00   },
  { code: "SAR", name: "Saudi Riyal",          flag: "🇸🇦", symbol: "ر.س", rate: 3.75,  balance: 0.00   },
];

export const CURRENCIES: Currency[] = [
  { code: "ZWL", name: "Zimbabwe Dollar",      flag: "🇿🇼", symbol: "Z$",  rate: 321.9996 },
  { code: "USD", name: "United States Dollar", flag: "🇺🇸", symbol: "$",   rate: 1.00     },
  { code: "EUR", name: "Euro",                 flag: "🇪🇺", symbol: "€",   rate: 0.94     },
  { code: "GBP", name: "British Pound",        flag: "🇬🇧", symbol: "£",   rate: 0.79     },
  { code: "BDT", name: "Bangladeshi Taka",     flag: "🇧🇩", symbol: "৳",   rate: 110.5    },
  { code: "AED", name: "UAE Dirham",           flag: "🇦🇪", symbol: "د.إ", rate: 3.67     },
  { code: "SAR", name: "Saudi Riyal",          flag: "🇸🇦", symbol: "ر.س", rate: 3.75     },
];

/* ─── Presentational primitives (no i18n / business logic) ───────────────── */

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-wide text-muted-foreground md:text-sm">{children}</p>
  );
}

export function Picker<T extends Currency>({
  value,
  options,
  onChange,
  heading,
  searchPlaceholder,
  noResultsText,
  showBalance = false,
}: {
  value: T;
  options: T[];
  onChange: (c: T) => void;
  heading: string;
  searchPlaceholder: string;
  noResultsText: string;
  showBalance?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = options.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <span className="text-base leading-none">{value.flag}</span>
        <span>{value.code}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-72 gap-0 p-0">
        <div className="px-4 pt-3 pb-2">
          <p className="text-sm font-semibold">{heading}</p>
        </div>
        <div className="px-2 pb-2">
          <div className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="scroll-thin max-h-64 overflow-y-auto rounded-b-[inherit] py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              {noResultsText}
            </p>
          ) : (
            filtered.map((c) => {
              const active = c.code === value.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onChange(c); setSearch(""); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 text-start transition-colors hover:bg-muted",
                    active && "bg-primary/5",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg leading-none ring-1 ring-border">
                    {c.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-semibold leading-tight", active && "text-primary")}>
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{c.code}</p>
                  </div>
                  {showBalance && "balance" in c && (
                    <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                      {c.symbol}{(c as Wallet).balance.toFixed(2)}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function AmountField<T extends Currency>({
  label,
  value,
  onChange,
  currency,
  options,
  onCurrencyChange,
  pickerHeading,
  searchPlaceholder,
  noResultsText,
  showBalance = false,
  readOnly = false,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  currency: T;
  options: T[];
  onCurrencyChange: (c: T) => void;
  pickerHeading: string;
  searchPlaceholder: string;
  noResultsText: string;
  showBalance?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div
        dir="ltr"
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 transition-colors",
          !readOnly && "focus-within:ring-3 focus-within:ring-ring/50",
          invalid && "ring-2 ring-destructive",
        )}
      >
        <span className="shrink-0 select-none text-sm font-semibold text-muted-foreground">
          {currency.symbol}
        </span>
        <input
          type="number"
          min="0"
          step="0.0001"
          placeholder="0.0000"
          readOnly={readOnly}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          onWheel={(e) => e.currentTarget.blur()}
          className="min-w-0 flex-1 bg-transparent text-base font-semibold tabular-nums text-foreground outline-none placeholder:text-muted-foreground read-only:cursor-default"
        />
        <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
        <Picker
          value={currency}
          options={options}
          onChange={onCurrencyChange}
          heading={pickerHeading}
          searchPlaceholder={searchPlaceholder}
          noResultsText={noResultsText}
          showBalance={showBalance}
        />
      </div>
    </div>
  );
}
