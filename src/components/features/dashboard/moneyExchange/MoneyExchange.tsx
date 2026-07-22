"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRightLeft,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Info,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { createExchangeSchema, type ExchangeFormValues } from "@/lib/validators/exchange";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type View = "form" | "overview" | "success";

type Currency = {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  /** Units per 1 USD. */
  rate: number;
};

type Wallet = Currency & { balance: number };

/* ─── Data ───────────────────────────────────────────────────────────────── */

const WALLETS: Wallet[] = [
  { code: "USD", name: "United States Dollar", flag: "🇺🇸", symbol: "$",   rate: 1.00,  balance: 979.66 },
  { code: "EUR", name: "Euro",                 flag: "🇪🇺", symbol: "€",   rate: 0.94,  balance: 320.40 },
  { code: "GBP", name: "British Pound",        flag: "🇬🇧", symbol: "£",   rate: 0.79,  balance: 150.00 },
  { code: "BDT", name: "Bangladeshi Taka",     flag: "🇧🇩", symbol: "৳",   rate: 110.5, balance: 0.00   },
  { code: "AED", name: "UAE Dirham",           flag: "🇦🇪", symbol: "د.إ", rate: 3.67,  balance: 0.00   },
  { code: "SAR", name: "Saudi Riyal",          flag: "🇸🇦", symbol: "ر.س", rate: 3.75,  balance: 0.00   },
];

const CURRENCIES: Currency[] = [
  { code: "ZWL", name: "Zimbabwe Dollar",      flag: "🇿🇼", symbol: "Z$",  rate: 321.9996 },
  { code: "USD", name: "United States Dollar", flag: "🇺🇸", symbol: "$",   rate: 1.00     },
  { code: "EUR", name: "Euro",                 flag: "🇪🇺", symbol: "€",   rate: 0.94     },
  { code: "GBP", name: "British Pound",        flag: "🇬🇧", symbol: "£",   rate: 0.79     },
  { code: "BDT", name: "Bangladeshi Taka",     flag: "🇧🇩", symbol: "৳",   rate: 110.5    },
  { code: "AED", name: "UAE Dirham",           flag: "🇦🇪", symbol: "د.إ", rate: 3.67     },
  { code: "SAR", name: "Saudi Riyal",          flag: "🇸🇦", symbol: "ر.س", rate: 3.75     },
];

const EX_FIXED_CHARGE   = 1.0;
const EX_PERCENT_CHARGE = 1.0;

/** Limits expressed in USD. */
const EX_MIN_USD = 1;
const EX_MAX_USD = 5000;
const EX_DAILY_REMAINING_USD = 10000;

const EX_LIMITS = [
  { key: "minAmount",        value: "1.0000 USD"      },
  { key: "maxAmount",        value: "5,000.0000 USD"  },
  { key: "dailyLimit",       value: "10,000.0000 USD" },
  { key: "remainingDaily",   value: "10,000.0000 USD" },
  { key: "monthlyLimit",     value: "50,000.0000 USD" },
  { key: "remainingMonthly", value: "50,000.0000 USD" },
] as const;

/* ─── Field helpers ──────────────────────────────────────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-wide text-muted-foreground md:text-sm">{children}</p>
  );
}

/* ─── Generic currency/wallet picker ─────────────────────────────────────── */

function Picker<T extends Currency>({
  value,
  options,
  onChange,
  heading,
  showBalance = false,
}: {
  value: T;
  options: T[];
  onChange: (c: T) => void;
  heading: string;
  showBalance?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("moneyExchange");

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
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="scroll-thin max-h-64 overflow-y-auto rounded-b-[inherit] py-1">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              {t("noCurrencies")}
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

/* ─── Amount field with picker on the trailing edge ──────────────────────── */

function ExchangeField<T extends Currency>({
  label,
  value,
  onChange,
  currency,
  options,
  onCurrencyChange,
  pickerHeading,
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
          showBalance={showBalance}
        />
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function PersonalMoneyExchange() {
  const [view, setView] = useState<View>("form");
  const t = useTranslations("moneyExchange");
  const tv = useTranslations("moneyExchange.validation");

  const schema = useMemo(() => createExchangeSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<ExchangeFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { amount: "", fromCode: WALLETS[0].code, toCode: CURRENCIES[0].code },
  });

  const amount = watch("amount");
  const fromCode = watch("fromCode");
  const toCode = watch("toCode");

  const fromWallet = WALLETS.find((w) => w.code === fromCode) ?? WALLETS[0];
  const toCurrency = CURRENCIES.find((c) => c.code === toCode) ?? CURRENCIES[0];

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const fromAmount = parseFloat(String(amount)) || 0;
  /** Units of toCurrency per 1 unit of fromWallet. */
  const rate = toCurrency.rate / fromWallet.rate;

  const pctCharge    = (fromAmount * EX_PERCENT_CHARGE) / 100;
  const totalCharge  = EX_FIXED_CHARGE + pctCharge;
  const totalPayable = fromAmount + totalCharge;
  const convertedAmt = fromAmount * rate;
  const convertedStr = fromAmount > 0 ? convertedAmt.toFixed(4) : "";

  const insufficientFunds = totalPayable > 0 && totalPayable > fromWallet.balance;

  const rateLabel = `1 ${fromWallet.code} = ${rate.toFixed(4)} ${toCurrency.code}`;

  const onSubmit = handleSubmit((values) => {
    const amt = Number(values.amount) || 0;
    const usd = amt / fromWallet.rate;

    if (usd < EX_MIN_USD) {
      toast.error(tv("min", { amount: EX_MIN_USD.toFixed(4) }));
      return;
    }
    if (usd > EX_MAX_USD) {
      toast.error(tv("max", { amount: EX_MAX_USD.toLocaleString("en-US") }));
      return;
    }
    if (usd > EX_DAILY_REMAINING_USD) {
      toast.error(tv("daily", { amount: EX_DAILY_REMAINING_USD.toLocaleString("en-US") }));
      return;
    }
    if (amt + totalCharge > fromWallet.balance) {
      setError("amount", { message: tv("insufficient") });
      toast.error(tv("insufficient"));
      return;
    }
    setView("overview");
  });

  function reset() {
    resetForm({ amount: "", fromCode: WALLETS[0].code, toCode: CURRENCIES[0].code });
    setView("form");
  }

  const overviewRows = [
    { label: t("rows.fromWallet"),         value: `${fromWallet.name} (${fromWallet.code})` },
    { label: t("rows.toExchange"),         value: `${toCurrency.name} (${toCurrency.code})` },
    { label: t("rows.exchangeRate"),       value: rateLabel },
    { label: t("rows.totalExchangeAmount"), value: `${fromAmount.toFixed(4)} ${fromWallet.code}` },
    { label: t("rows.convertedAmount"),    value: `${convertedAmt.toFixed(4)} ${toCurrency.code}` },
    { label: t("rows.totalCharge"),        value: `${totalCharge.toFixed(4)} ${fromWallet.code}` },
    { label: t("rows.totalPayable"),       value: `${totalPayable.toFixed(4)} ${fromWallet.code}`, highlight: true },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: form / overview / success */}
        <div className="glass rounded-2xl p-5">
          {view === "form" && (
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Form title */}
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <ArrowRightLeft className="size-4 text-primary" />
                </span>
                <p className="text-sm font-semibold">{t("formTitle")}</p>
              </div>

              {/* hidden RHF registrations for picker fields */}
              <input type="hidden" {...register("fromCode")} />
              <input type="hidden" {...register("toCode")} />

              <ExchangeField
                label={t("exchangeFrom")}
                value={String(amount ?? "")}
                onChange={(v) => setValue("amount", v, { shouldValidate: true })}
                currency={fromWallet}
                options={WALLETS}
                onCurrencyChange={(w) => setValue("fromCode", w.code, { shouldValidate: true })}
                pickerHeading={t("selectWallet")}
                showBalance
                invalid={insufficientFunds || !!errors.amount}
              />

              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}

              {/* Exchange rate divider */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowUpDown className="size-3.5 text-primary" />
                  <span>{rateLabel}</span>
                </div>
                <span className="h-px flex-1 bg-border" />
              </div>

              <ExchangeField
                label={t("exchangeTo")}
                value={convertedStr}
                currency={toCurrency}
                options={CURRENCIES}
                onCurrencyChange={(c) => setValue("toCode", c.code, { shouldValidate: true })}
                pickerHeading={t("selectCurrency")}
                readOnly
              />

              {errors.toCode && (
                <p className="text-xs text-destructive">{errors.toCode.message}</p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={fromAmount <= 0}
                className="mt-2 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
              >
                {t("exchangeMoney")}
                <ArrowRightLeft className="ms-2 size-4" />
              </Button>
            </form>
          )}

          {view === "overview" && (
            <div className="space-y-4">
              <p className="text-base font-bold">{t("overviewTitle")}</p>
              <div className="space-y-2">
                {overviewRows.map(({ label, value, highlight }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-3 py-2.5"
                  >
                    <span className={cn("shrink-0 text-xs text-muted-foreground md:text-sm", highlight && "font-semibold text-foreground")}>
                      {label}
                    </span>
                    <span className={cn("text-end text-xs font-medium tabular-nums md:text-sm", highlight && "font-semibold text-primary")}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="h-11 flex-1" onClick={() => setView("form")}>
                  <ArrowLeft className="me-2 size-4 rtl:rotate-180" />
                  {t("back")}
                </Button>
                <Button
                  size="lg"
                  className="h-11 flex-1 [background:var(--gradient)] text-white hover:opacity-90"
                  onClick={pinConfirm.open}
                >
                  {t("exchangeMoney")}
                  <ArrowRightLeft className="ms-2 size-4" />
                </Button>
              </div>
            </div>
          )}

          {view === "success" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-9 text-emerald-500" />
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold">{t("successTitle")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("successDetail", {
                    from: `${fromAmount.toFixed(4)} ${fromWallet.code}`,
                    to: `${convertedAmt.toFixed(4)} ${toCurrency.code}`,
                  })}
                </p>
              </div>
              <div className="w-full space-y-2 pt-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{t("rows.totalPayable")}</span>
                  <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                    {totalPayable.toFixed(4)} {fromWallet.code}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{t("rows.convertedAmount")}</span>
                  <span className="text-xs font-semibold tabular-nums md:text-sm">
                    {convertedAmt.toFixed(4)} {toCurrency.code}
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
                onClick={reset}
              >
                {t("newExchange")}
              </Button>
            </div>
          )}
        </div>

        {/* Right: limitations */}
        <div className="glass h-full rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Info className="size-4 text-primary" />
            </span>
            <p className="text-sm font-semibold">{t("limitationsTitle")}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5">
              <span className="text-xs font-medium text-foreground md:text-sm">{t("availableBalance")}</span>
              <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                {fromWallet.symbol}{fromWallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            {EX_LIMITS.map(({ key, value }) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5"
              >
                <span className="text-xs text-muted-foreground md:text-sm">{t(`limits.${key}`)}</span>
                <span className="text-xs font-medium tabular-nums md:text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PinConfirmDialog
        isOpen={pinConfirm.isOpen}
        state={pinConfirm.state}
        error={pinConfirm.error}
        close={pinConfirm.close}
        submit={pinConfirm.submit}
        title={t("confirmTitle")}
        description={t("confirmDescription")}
      />
    </div>
  );
}
