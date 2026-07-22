"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  Info,
  ScanLine,
  SendHorizontal,
  User,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { createRemittanceSchema, type RemittanceFormValues } from "@/lib/validators/remittance";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { RecipientListDialog } from "@/components/shared/RecipientListDialog";
import { QrScannerDialog } from "@/components/shared/QrScannerDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";
import { useQrScanner } from "@/hooks/user/useQrScanner";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type View = "form" | "preview" | "success";

type Currency = {
  code: string;
  name: string;
  symbol: string;
  /** Units per 1 USD. */
  rate: number;
};

/* ─── Data ───────────────────────────────────────────────────────────────── */

const COUNTRIES: Currency[] = [
  { code: "USD", name: "United States dollar", symbol: "$",  rate: 1.00     },
  { code: "ZWL", name: "Zimbabwe Dollar",      symbol: "Z$", rate: 321.9996 },
  { code: "EUR", name: "Euro",                 symbol: "€",  rate: 0.94     },
  { code: "GBP", name: "British Pound",        symbol: "£",  rate: 0.79     },
  { code: "BDT", name: "Bangladeshi Taka",     symbol: "৳",  rate: 110.5    },
  { code: "NGN", name: "Nigerian Naira",       symbol: "₦",  rate: 1550     },
  { code: "KES", name: "Kenyan Shilling",      symbol: "KSh", rate: 129.5   },
];

const TRANSACTION_TYPES = [
  { value: "bank-transfer",  label: "Bank Transfer"  },
  { value: "cash-pickup",    label: "Cash Pickup"    },
  { value: "mobile-money",   label: "Mobile Money"   },
  { value: "wallet-deposit", label: "Wallet Deposit" },
];

const FIXED_CHARGE   = 1.0;
const PERCENT_CHARGE = 1.0;

/** Limits expressed in USD. */
const RM_MIN_USD = 20;
const RM_MAX_USD = 15000;
const RM_DAILY_REMAINING_USD = 100;
const RM_AVAILABLE_BALANCE = 979.66;

const RM_LIMITS = [
  { key: "transactionLimit", value: "20.0000 USD – 15,000.0000 USD" },
  { key: "dailyLimit",       value: "100.0000 USD"                  },
  { key: "remainingDaily",   value: "100.0000 USD"                  },
  { key: "monthlyLimit",     value: "1,000.0000 USD"                },
  { key: "remainingMonthly", value: "1,000.0000 USD"                },
] as const;

/* ─── Field helpers ──────────────────────────────────────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-wide text-muted-foreground md:text-sm">{children}</p>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function RemittancePage() {
  const t = useTranslations("remittanceForm");
  const tv = useTranslations("remittanceForm.validation");

  const [view, setView] = useState<View>("form");
  const [recipientOpen, setRecipientOpen] = useState(false);

  const schema = useMemo(() => createRemittanceSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<RemittanceFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      fromCode: "USD",
      toCode: "ZWL",
      transactionType: "bank-transfer",
      recipient: "",
      amount: "",
    },
  });

  const fromCode = String(watch("fromCode") ?? "");
  const toCode = String(watch("toCode") ?? "");
  const transactionType = String(watch("transactionType") ?? "");
  const recipient = String(watch("recipient") ?? "");
  const amount = String(watch("amount") ?? "");

  const fromCountry = COUNTRIES.find((c) => c.code === fromCode) ?? COUNTRIES[0];
  const toCountry = COUNTRIES.find((c) => c.code === toCode) ?? COUNTRIES[1];

  const qr = useQrScanner((scanned) => setValue("recipient", scanned, { shouldValidate: true }));

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const rate = toCountry.rate / fromCountry.rate;
  const parsed = parseFloat(amount) || 0;
  const recvAmount = parsed * rate;
  const recvStr = parsed > 0 ? recvAmount.toFixed(4) : "";
  const pctCharge = (parsed * PERCENT_CHARGE) / 100;
  const transferFee = FIXED_CHARGE + pctCharge;
  const totalPayable = parsed + transferFee;

  const rateLabel = `1 ${fromCountry.code} = ${rate.toFixed(4)} ${toCountry.code}`;
  const typeLabel = TRANSACTION_TYPES.find((x) => x.value === transactionType)?.label ?? "—";

  const onSubmit = handleSubmit((values) => {
    const amt = Number(values.amount) || 0;
    const usd = amt / fromCountry.rate;
    if (usd < RM_MIN_USD) {
      setError("amount", { message: tv("min", { amount: RM_MIN_USD.toFixed(4) }) });
      toast.error(tv("min", { amount: RM_MIN_USD.toFixed(4) }));
      return;
    }
    if (usd > RM_MAX_USD) {
      setError("amount", { message: tv("max", { amount: RM_MAX_USD.toLocaleString("en-US") }) });
      toast.error(tv("max", { amount: RM_MAX_USD.toLocaleString("en-US") }));
      return;
    }
    if (usd > RM_DAILY_REMAINING_USD) {
      toast.error(tv("daily", { amount: RM_DAILY_REMAINING_USD.toLocaleString("en-US") }));
      return;
    }
    if (amt + transferFee > RM_AVAILABLE_BALANCE) {
      setError("amount", { message: tv("insufficient") });
      toast.error(tv("insufficient"));
      return;
    }
    setView("preview");
  });

  function reset() {
    resetForm({
      fromCode: "USD",
      toCode: "ZWL",
      transactionType: "bank-transfer",
      recipient: "",
      amount: "",
    });
    setView("form");
  }

  const previewRows = [
    { label: t("rows.sendingCountry"),   value: fromCountry.name },
    { label: t("rows.receivingCountry"), value: toCountry.name },
    { label: t("rows.recipient"),        value: recipient || t("chooseRecipient") },
    { label: t("rows.transactionType"),  value: typeLabel },
    { label: t("rows.sendingAmount"),    value: `${parsed.toFixed(4)} ${fromCountry.code}` },
    { label: t("rows.transferFee"),      value: `${transferFee.toFixed(4)} ${fromCountry.code}` },
    { label: t("rows.recipientGet"),     value: `${recvAmount.toFixed(4)} ${toCountry.code}` },
    { label: t("rows.totalPayable"),     value: `${totalPayable.toFixed(4)} ${fromCountry.code}`, highlight: true },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: form / preview / success */}
        <div className="glass rounded-2xl p-5">
          {view === "success" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-9 text-emerald-500" />
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold">{t("successTitle")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("successDetail", {
                    amount: `${parsed.toFixed(4)} ${fromCountry.code}`,
                    recipient: recipient || "—",
                  })}
                </p>
              </div>
              <div className="w-full space-y-2 pt-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{t("rows.recipientGet")}</span>
                  <span className="text-xs font-semibold tabular-nums md:text-sm">
                    {recvAmount.toFixed(4)} {toCountry.code}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{t("rows.totalPayable")}</span>
                  <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                    {totalPayable.toFixed(4)} {fromCountry.code}
                  </span>
                </div>
              </div>
              <Button
                size="lg"
                className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
                onClick={reset}
              >
                {t("newRemittance")}
              </Button>
            </div>
          )}

          {view === "preview" && (
            <div className="space-y-4">
              <p className="text-base font-bold">{t("preview")}</p>
              <div className="space-y-2">
                {previewRows.map(({ label, value, highlight }) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-3 py-2.5">
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
                  {t("continue")}
                  <SendHorizontal className="ms-2 size-4" />
                </Button>
              </div>
            </div>
          )}

          {view === "form" && (
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Form title */}
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <SendHorizontal className="size-4 text-primary" />
                </span>
                <p className="text-sm font-semibold">{t("formTitle")}</p>
              </div>

              {/* From / To country */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel>{t("fromCountry")}</FieldLabel>
                  <input type="hidden" {...register("fromCode")} />
                  <Select value={fromCode} onValueChange={(v) => setValue("fromCode", v, { shouldValidate: true })}>
                    <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="ps-3 py-2.5">
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <FieldLabel>{t("toCountry")}</FieldLabel>
                  <input type="hidden" {...register("toCode")} />
                  <Select value={toCode} onValueChange={(v) => setValue("toCode", v, { shouldValidate: true })}>
                    <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="ps-3 py-2.5">
                          {c.name} ({c.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transaction type */}
              <div className="space-y-2">
                <FieldLabel>{t("transactionType")}</FieldLabel>
                <input type="hidden" {...register("transactionType")} />
                <Select value={transactionType} onValueChange={(v) => setValue("transactionType", v, { shouldValidate: true })}>
                  <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_TYPES.map((x) => (
                      <SelectItem key={x.value} value={x.value} className="ps-3 py-2.5">
                        {x.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recipient (money-transfer style) */}
              <div className="space-y-2">
                <FieldLabel>{t("recipient")}</FieldLabel>
                <input type="hidden" {...register("recipient")} />
                <div
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 transition-colors focus-within:ring-3 focus-within:ring-ring/50",
                    errors.recipient && "ring-2 ring-destructive",
                  )}
                >
                  <User className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t("selectRecipient")}
                    value={recipient}
                    onChange={(e) => setValue("recipient", e.target.value, { shouldValidate: true })}
                    className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground md:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setRecipientOpen(true)}
                    className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={t("selectRecipientAria")}
                  >
                    <Users className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={qr.open}
                    className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={t("scanQr")}
                  >
                    <ScanLine className="size-4" />
                  </button>
                </div>
                {errors.recipient && (
                  <p className="text-xs text-destructive">{errors.recipient.message}</p>
                )}
              </div>

              {/* Sending amount (exchange-style field) */}
              <div className="space-y-2">
                <FieldLabel>{t("sendingAmount")}</FieldLabel>
                <div
                  dir="ltr"
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 transition-colors focus-within:ring-3 focus-within:ring-ring/50",
                    !!errors.amount && "ring-2 ring-destructive",
                  )}
                >
                  <span className="shrink-0 select-none text-sm font-semibold text-muted-foreground">{fromCountry.symbol}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    placeholder={'0.00'}
                    value={amount}
                    onChange={(e) => setValue("amount", e.target.value, { shouldValidate: true })}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="min-w-0 flex-1 bg-transparent text-base font-semibold tabular-nums text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
                  <span className="shrink-0 text-sm font-semibold text-foreground">{fromCountry.code}</span>
                </div>
              </div>

              {/* Exchange rate divider (money-transfer style) */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowUpDown className="size-3.5 text-primary" />
                  <span>{rateLabel}</span>
                </div>
                <span className="h-px flex-1 bg-border" />
              </div>

              {/* Recipient get (exchange-style field) */}
              <div className="space-y-2">
                <FieldLabel>{t("recipientGet")}</FieldLabel>
                <div dir="ltr" className="flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3">
                  <span className="shrink-0 select-none text-sm font-semibold text-muted-foreground">{toCountry.symbol}</span>
                  <input
                    type="text"
                    readOnly
                    value={recvStr}
                    placeholder="0.00"
                    className="min-w-0 flex-1 cursor-default bg-transparent text-base font-semibold tabular-nums text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <span aria-hidden className="h-5 w-px shrink-0 bg-border" />
                  <span className="shrink-0 text-sm font-semibold text-foreground">{toCountry.code}</span>
                </div>
              </div>

              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={parsed <= 0 || !recipient.trim()}
                className="mt-2 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
              >
                {t("continue")}
                <ArrowRight className="ms-2 size-4 rtl:rotate-180" />
              </Button>
            </form>
          )}
        </div>

        {/* Right: limit information */}
        <div className="glass h-full rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Info className="size-4 text-primary" />
            </span>
            <p className="text-sm font-semibold">{t("limitTitle")}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2.5">
              <span className="text-xs font-medium text-foreground md:text-sm">{t("availableBalance")}</span>
              <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                {RM_AVAILABLE_BALANCE.toLocaleString("en-US", { minimumFractionDigits: 2 })} {fromCountry.code}
              </span>
            </div>
            {RM_LIMITS.map(({ key, value }) => (
              <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                <span className="text-xs text-muted-foreground md:text-sm">{t(`limits.${key}`)}</span>
                <span className="text-xs font-medium tabular-nums md:text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RecipientListDialog
        isOpen={recipientOpen}
        onClose={() => setRecipientOpen(false)}
        onSelect={(id) => setValue("recipient", id, { shouldValidate: true })}
      />

      <QrScannerDialog
        isOpen={qr.isOpen}
        close={qr.close}
        onScan={qr.onScan}
        onError={qr.onError}
      />

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
