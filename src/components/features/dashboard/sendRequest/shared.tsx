"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Info, ScanLine, Search, User, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { QrScannerDialog } from "@/components/shared/QrScannerDialog";
import { RecipientListDialog } from "@/components/shared/RecipientListDialog";
import { useQrScanner } from "@/hooks/user/useQrScanner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ─── Types & data ───────────────────────────────────────────────────────── */

export type Currency = {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  /** Relative to USD. */
  rate: number;
};

export const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar",         flag: "🇺🇸", symbol: "$",   rate: 1.00    },
  { code: "EUR", name: "Euro",              flag: "🇪🇺", symbol: "€",   rate: 0.94    },
  { code: "GBP", name: "British Pound",     flag: "🇬🇧", symbol: "£",   rate: 0.79    },
  { code: "CAD", name: "Canadian Dollar",   flag: "🇨🇦", symbol: "CA$", rate: 1.35    },
  { code: "JPY", name: "Japanese Yen",      flag: "🇯🇵", symbol: "¥",   rate: 147.92  },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", symbol: "A$",  rate: 1.53    },
  { code: "BDT", name: "Bangladeshi Taka",  flag: "🇧🇩", symbol: "৳",   rate: 110.5   },
  { code: "AED", name: "UAE Dirham",        flag: "🇦🇪", symbol: "د.إ", rate: 3.67    },
  { code: "SAR", name: "Saudi Riyal",       flag: "🇸🇦", symbol: "ر.س", rate: 3.75    },
  { code: "TRY", name: "Turkish Lira",      flag: "🇹🇷", symbol: "₺",   rate: 27.12   },
  { code: "NGN", name: "Nigerian Naira",    flag: "🇳🇬", symbol: "₦",   rate: 1550    },
  { code: "KES", name: "Kenyan Shilling",   flag: "🇰🇪", symbol: "KSh", rate: 129.5   },
];

export const GATEWAYS = [
  { value: "bank-transfer", label: "Bank Transfer" },
  { value: "paypal",        label: "PayPal"        },
  { value: "stripe",        label: "Stripe"        },
  { value: "wire",          label: "Wire Transfer" },
];

export const FIXED_CHARGE = 1.0;
export const PERCENT_CHARGE = 1.0;

/** Limits expressed in USD. */
export const SEND_MIN_USD = 10;
export const SEND_MAX_USD = 1000;
export const SEND_DAILY_REMAINING_USD = 10000;

const LIMITS = [
  { key: "transactionLimit", value: "10.0000 – 1,000.0000 USD" },
  { key: "dailyLimit",       value: "10,000.0000 USD"          },
  { key: "remainingDaily",   value: "10,000.0000 USD"          },
  { key: "monthlyLimit",     value: "50,000.0000 USD"          },
  { key: "remainingMonthly", value: "50,000.0000 USD"          },
] as const;

/* ─── Primitives ─────────────────────────────────────────────────────────── */

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs md:text-sm tracking-wide text-muted-foreground">{children}</p>
  );
}

export function CurrencyPicker({
  value,
  onChange,
  heading,
}: {
  value: Currency;
  onChange: (c: Currency) => void;
  heading: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("sendRequest");

  const filtered = useMemo(
    () =>
      CURRENCIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
        <span className="text-base leading-none">{value.flag}</span>
        <span>{value.code}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={8} className="w-64 gap-0 p-0">
        <div className="px-4 pt-3 pb-2">
          <p className="text-sm font-semibold">{heading}</p>
        </div>
        <div className="px-2 pb-2">
          <div className="flex items-center gap-2 rounded-md bg-muted px-2.5 py-1.5">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="scroll-thin max-h-60 overflow-y-auto rounded-b-[inherit] py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">{t("noCurrencies")}</p>
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

export function CurrencyInput({
  value,
  onChange,
  currency,
  onCurrencyChange,
  pickerHeading,
  readOnly = false,
  invalid = false,
}: {
  value: string;
  onChange?: (v: string) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  pickerHeading: string;
  readOnly?: boolean;
  invalid?: boolean;
}) {
  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-11 items-center gap-2 rounded-lg border border-input bg-muted/40 px-3 transition-colors",
        !readOnly && "focus-within:border-primary",
        invalid && "border-destructive",
      )}
    >
      <span className="shrink-0 select-none text-sm font-semibold text-muted-foreground">{currency.symbol}</span>
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        readOnly={readOnly}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        onWheel={(e) => e.currentTarget.blur()}
        className="min-w-0 flex-1 bg-transparent text-base font-semibold tabular-nums text-foreground outline-none placeholder:text-muted-foreground read-only:cursor-default"
      />
      <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
      <CurrencyPicker value={currency} onChange={onCurrencyChange} heading={pickerHeading} />
    </div>
  );
}

/** Large serif amount panel with a currency picker — matches the send design. */
export function BigAmountInput({
  label,
  value,
  onChange,
  currency,
  onCurrencyChange,
  pickerHeading,
  subtext,
  readOnly = false,
  accent = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  pickerHeading: string;
  subtext?: string;
  readOnly?: boolean;
  accent?: boolean;
}) {
  return (
    <div dir="ltr">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
          {label}
        </span>
        <span className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold shadow-sm">
          <CurrencyPicker value={currency} onChange={onCurrencyChange} heading={pickerHeading} />
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
            "w-full bg-transparent text-center font-hero text-[clamp(48px,8vw,72px)] leading-none font-bold tracking-tight outline-none tabular-nums placeholder:text-muted-foreground/30 read-only:cursor-default",
            accent ? "text-primary" : "text-foreground",
          )}
        />
      </div>
      {/* Reserve the subtext row on both columns so the number baselines stay
          aligned even when only one side has a subtext. */}
      <div className="mt-2 min-h-[18px] text-center text-[13px] text-muted-foreground">
        {subtext}
      </div>
    </div>
  );
}

export function RecipientField({
  label,
  value,
  onChange,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const t = useTranslations("sendRequest");
  const [listOpen, setListOpen] = useState(false);
  const qr = useQrScanner((scanned) => onChange(scanned));

  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg border border-input bg-muted/40 px-3 transition-colors focus-within:border-primary",
          invalid && "border-destructive",
        )}
      >
        <User className="size-4 shrink-0 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("recipientPlaceholder")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground md:text-sm"
        />
        <button type="button" onClick={() => setListOpen(true)} className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground" aria-label={t("selectRecipient")}>
          <Users className="size-4" />
        </button>
        <button type="button" onClick={qr.open} className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground" aria-label={t("scanQr")}>
          <ScanLine className="size-4" />
        </button>
      </div>
      <RecipientListDialog isOpen={listOpen} onClose={() => setListOpen(false)} onSelect={(id) => onChange(id)} />
      <QrScannerDialog isOpen={qr.isOpen} close={qr.close} onScan={qr.onScan} onError={qr.onError} />
    </div>
  );
}

export function LimitPanel() {
  const t = useTranslations("sendRequest");
  return (
    <div className="glass h-full rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Info className="size-4 text-primary" />
        </span>
        <p className="text-sm font-semibold">{t("limitationsTitle")}</p>
      </div>
      <div className="space-y-2">
        {LIMITS.map(({ key, value }) => (
          <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
            <span className="text-xs text-muted-foreground md:text-sm">{t(`limits.${key}`)}</span>
            <span className="text-xs font-medium tabular-nums md:text-sm">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
