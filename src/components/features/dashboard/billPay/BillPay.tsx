"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Info,
  Receipt,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { createBillPaySchema, type BillPayFormValues } from "@/lib/validators/billPay";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type View = "form" | "overview" | "success";

type Wallet = {
  code: string;
  name: string;
  flag: string;
  symbol: string;
  /** Units per 1 USD. */
  rate: number;
  balance: number;
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const WALLETS: Wallet[] = [
  { code: "USD", name: "United States Dollar", flag: "🇺🇸", symbol: "$",   rate: 1.00,  balance: 979.66 },
  { code: "EUR", name: "Euro",                 flag: "🇪🇺", symbol: "€",   rate: 0.94,  balance: 320.40 },
  { code: "GBP", name: "British Pound",        flag: "🇬🇧", symbol: "£",   rate: 0.79,  balance: 150.00 },
  { code: "BDT", name: "Bangladeshi Taka",     flag: "🇧🇩", symbol: "৳",   rate: 110.5, balance: 0.00   },
  { code: "AED", name: "UAE Dirham",           flag: "🇦🇪", symbol: "د.إ", rate: 3.67,  balance: 0.00   },
];

/** Biller currency — bills settle in NGN. Units per 1 USD. */
const BILL_CURRENCY = { code: "NGN", rate: 1376.1305 };

const BILL_TYPES = [
  { value: "ikeja-postpaid", label: "Ikeja Electricity Postpaid" },
  { value: "ikeja-prepaid",  label: "Ikeja Electricity Prepaid"  },
  { value: "dstv",           label: "DSTV Subscription"          },
  { value: "water",          label: "Water Bill"                 },
  { value: "internet",       label: "Internet Bill"              },
] as const;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
].map((m) => ({ value: `${m}-2026`, label: `${m} 2026` }));

const FIXED_CHARGE   = 1.0;
const PERCENT_CHARGE = 1.0;

/** Limits expressed in USD. */
const MIN_USD = 0.2543;
const MAX_USD = 218.0026;
const DAILY_REMAINING_USD = 100;

const LIMITS = [
  { key: "transactionLimit", value: "0.2543 USD - 218.0026 USD" },
  { key: "dailyLimit",       value: "100.0000 USD"              },
  { key: "remainingDaily",   value: "100.0000 USD"              },
  { key: "monthlyLimit",     value: "1,000.0000 USD"            },
  { key: "remainingMonthly", value: "1,000.0000 USD"            },
] as const;

/* ─── Field helpers ──────────────────────────────────────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-wide text-muted-foreground md:text-sm">{children}</p>
  );
}

/* ─── Wallet picker ──────────────────────────────────────────────────────── */

function WalletPicker({
  value,
  onChange,
  heading,
}: {
  value: Wallet;
  onChange: (w: Wallet) => void;
  heading: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const t = useTranslations("payBill");

  const filtered = WALLETS.filter(
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
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-semibold leading-tight", active && "text-primary")}>
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{c.code}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                    {c.symbol}{c.balance.toFixed(2)}
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

/* ─── Amount field with wallet picker on the trailing edge ───────────────── */

function AmountField({
  label,
  value,
  onChange,
  wallet,
  onWalletChange,
  pickerHeading,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  wallet: Wallet;
  onWalletChange: (w: Wallet) => void;
  pickerHeading: string;
  invalid?: boolean;
}) {
  return (
    <div className="space-y-2">
      <FieldLabel>{label}</FieldLabel>
      <div
        dir="ltr"
        className={cn(
          "flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 transition-colors focus-within:ring-3 focus-within:ring-ring/50",
          invalid && "ring-2 ring-destructive",
        )}
      >
        <span className="shrink-0 select-none text-sm font-semibold text-muted-foreground">{wallet.symbol}</span>
        <input
          type="number"
          min="0"
          step="0.0001"
          placeholder="0.0000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
          className="min-w-0 flex-1 bg-transparent text-base font-semibold tabular-nums text-foreground outline-none placeholder:text-muted-foreground"
        />
        <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
        <WalletPicker value={wallet} onChange={onWalletChange} heading={pickerHeading} />
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function BillPayPage() {
  const [view, setView] = useState<View>("form");
  const t = useTranslations("payBill");
  const tv = useTranslations("payBill.validation");

  const schema = useMemo(() => createBillPaySchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<BillPayFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      billType: BILL_TYPES[0].value,
      billMonth: MONTHS[0].value,
      billNumber: "",
      amount: "",
      payCode: WALLETS[0].code,
    },
  });

  const billType = watch("billType");
  const billMonth = watch("billMonth");
  const billNumber = String(watch("billNumber") ?? "");
  const amount = watch("amount");
  const payCode = watch("payCode");

  const payWallet = WALLETS.find((w) => w.code === payCode) ?? WALLETS[0];

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const senderAmount = parseFloat(String(amount)) || 0;
  const rate = BILL_CURRENCY.rate / payWallet.rate;
  const totalCharge  = FIXED_CHARGE + (senderAmount * PERCENT_CHARGE) / 100;
  const totalPayable = senderAmount + totalCharge;
  const conversion   = senderAmount * rate;
  const insufficientFunds = totalPayable > 0 && totalPayable > payWallet.balance;
  const rateLabel = `1 ${payWallet.code} = ${rate.toFixed(4)} ${BILL_CURRENCY.code}`;

  const billTypeLabel = BILL_TYPES.find((b) => b.value === billType)?.label ?? "—";
  const billMonthLabel = MONTHS.find((m) => m.value === billMonth)?.label ?? "—";

  const onSubmit = handleSubmit((values) => {
    const amt = Number(values.amount) || 0;
    const usd = amt / payWallet.rate;

    if (usd < MIN_USD) {
      setError("amount", { message: tv("min", { amount: MIN_USD.toFixed(4) }) });
      toast.error(tv("min", { amount: MIN_USD.toFixed(4) }));
      return;
    }
    if (usd > MAX_USD) {
      setError("amount", { message: tv("max", { amount: MAX_USD.toFixed(4) }) });
      toast.error(tv("max", { amount: MAX_USD.toFixed(4) }));
      return;
    }
    if (usd > DAILY_REMAINING_USD) {
      toast.error(tv("daily", { amount: DAILY_REMAINING_USD.toLocaleString("en-US") }));
      return;
    }
    if (amt + totalCharge > payWallet.balance) {
      setError("amount", { message: tv("insufficient") });
      toast.error(tv("insufficient"));
      return;
    }
    setView("overview");
  });

  function reset() {
    resetForm({
      billType: BILL_TYPES[0].value,
      billMonth: MONTHS[0].value,
      billNumber: "",
      amount: "",
      payCode: WALLETS[0].code,
    });
    setView("form");
  }

  const overviewRows = [
    { label: t("rows.billPay"),      value: billTypeLabel },
    { label: t("rows.billMonth"),    value: billMonthLabel },
    { label: t("rows.billNumber"),   value: billNumber || "—" },
    { label: t("rows.amount"),       value: `${senderAmount.toFixed(4)} ${payWallet.code}` },
    { label: t("rows.conversion"),   value: `${conversion.toFixed(4)} ${BILL_CURRENCY.code}` },
    { label: t("rows.totalCharge"),  value: `${FIXED_CHARGE.toFixed(4)} ${payWallet.code} + ${PERCENT_CHARGE.toFixed(4)}% = ${totalCharge.toFixed(4)} ${payWallet.code}` },
    { label: t("rows.totalPayable"), value: `${totalPayable.toFixed(4)} ${payWallet.code}`, highlight: true },
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
                  <Receipt className="size-4 text-primary" />
                </span>
                <p className="text-sm font-semibold">{t("formTitle")}</p>
              </div>

              <input type="hidden" {...register("payCode")} />

              {/* Exchange rate divider */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowUpDown className="size-3.5 text-primary" />
                  <span dir="ltr">{rateLabel}</span>
                </div>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Bill Type */}
                <div className="space-y-2">
                  <FieldLabel>{t("billType")}</FieldLabel>
                  <Select value={billType} onValueChange={(v) => setValue("billType", v, { shouldValidate: true })}>
                    <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BILL_TYPES.map((b) => (
                        <SelectItem key={b.value} value={b.value} className="ps-3 py-2.5">{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bill Month */}
                <div className="space-y-2">
                  <FieldLabel>{t("billMonth")}</FieldLabel>
                  <Select value={billMonth} onValueChange={(v) => setValue("billMonth", v, { shouldValidate: true })}>
                    <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value} className="ps-3 py-2.5">{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Bill Number */}
                <div className="space-y-2">
                  <FieldLabel>{t("billNumber")}</FieldLabel>
                  <Input
                    value={billNumber}
                    onChange={(e) => setValue("billNumber", e.target.value, { shouldValidate: true })}
                    placeholder={t("billNumberPlaceholder")}
                    aria-invalid={!!errors.billNumber}
                    className="h-11 border-0 bg-muted/40"
                  />
                </div>

                {/* Amount */}
                <AmountField
                  label={t("amount")}
                  value={String(amount ?? "")}
                  onChange={(v) => setValue("amount", v, { shouldValidate: true })}
                  wallet={payWallet}
                  onWalletChange={(w) => setValue("payCode", w.code, { shouldValidate: true })}
                  pickerHeading={t("selectWallet")}
                  invalid={insufficientFunds || !!errors.amount}
                />
              </div>

              {(errors.billNumber || errors.amount) && (
                <p className="text-xs text-destructive">
                  {errors.billNumber?.message ?? errors.amount?.message}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={senderAmount <= 0 || !billNumber.trim()}
                className="mt-2 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
              >
                {t("payBill")}
                <Receipt className="ms-2 size-4" />
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
                  {t("payBill")}
                  <Receipt className="ms-2 size-4" />
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
                    amount: `${senderAmount.toFixed(4)} ${payWallet.code}`,
                    bill: billTypeLabel,
                  })}
                </p>
              </div>
              <div className="w-full space-y-2 pt-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{t("rows.conversion")}</span>
                  <span className="text-xs font-semibold tabular-nums md:text-sm">
                    {conversion.toFixed(4)} {BILL_CURRENCY.code}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{t("rows.totalPayable")}</span>
                  <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                    {totalPayable.toFixed(4)} {payWallet.code}
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
                onClick={reset}
              >
                {t("newBill")}
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
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="text-xs font-medium text-foreground md:text-sm">{t("availableBalance")}</span>
              <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                {payWallet.symbol}{payWallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            {LIMITS.map(({ key, value }) => (
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
