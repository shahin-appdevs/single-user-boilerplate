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
  CreditCard,
  Info,
  ScanLine,
  Store,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { createPaymentSchema, type PaymentFormValues } from "@/lib/validators/payment";
import { Button } from "@/components/ui/button";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { QrScannerDialog } from "@/components/shared/QrScannerDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";
import { useQrScanner } from "@/hooks/user/useQrScanner";
import {
  AmountField,
  CURRENCIES,
  FieldLabel,
  WALLETS,
} from "./shared";

type View = "form" | "overview" | "success";

/* ── Make Payment business rules (own calculation + limits) ──────────────── */

const FIXED_CHARGE   = 1.0;
const PERCENT_CHARGE = 1.0;

/** Limits expressed in USD. */
const MIN_USD = 1;
const MAX_USD = 100;
const DAILY_REMAINING_USD = 58.67;

const LIMITS = [
  { key: "transactionLimit", value: "1.0000 USD - 100.0000 USD" },
  { key: "dailyLimit",       value: "100.0000 USD"              },
  { key: "remainingDaily",   value: "58.6700 USD"               },
  { key: "monthlyLimit",     value: "1,000.0000 USD"            },
  { key: "remainingMonthly", value: "958.6700 USD"              },
] as const;

export function MakePaymentForm() {
  const t = useTranslations("payment");
  const tp = useTranslations("payout");
  const tv = useTranslations("payment.validation");

  const [view, setView] = useState<View>("form");
  const [note, setNote] = useState("");

  const schema = useMemo(() => createPaymentSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { account: "", amount: "", fromCode: WALLETS[0].code, toCode: CURRENCIES[0].code },
  });

  const account = String(watch("account") ?? "");
  const amount = watch("amount");
  const fromCode = watch("fromCode");
  const toCode = watch("toCode");

  const fromWallet = WALLETS.find((w) => w.code === fromCode) ?? WALLETS[0];
  const toCurrency = CURRENCIES.find((c) => c.code === toCode) ?? CURRENCIES[0];

  // TODO: replace with the Make Payment API mutation.
  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const qr = useQrScanner((scanned) =>
    setValue("account", scanned, { shouldValidate: true }),
  );

  const senderAmount = parseFloat(String(amount)) || 0;
  const rate = toCurrency.rate / fromWallet.rate;
  const totalCharge  = FIXED_CHARGE + (senderAmount * PERCENT_CHARGE) / 100;
  const totalPayable = senderAmount + totalCharge;
  const receiverAmt  = senderAmount * rate;
  const receiverStr  = senderAmount > 0 ? receiverAmt.toFixed(4) : "";
  const insufficientFunds = totalPayable > 0 && totalPayable > fromWallet.balance;
  const rateLabel = `1 ${fromWallet.code} = ${rate.toFixed(4)} ${toCurrency.code}`;

  const onSubmit = handleSubmit((values) => {
    const amt = Number(values.amount) || 0;
    const usd = amt / fromWallet.rate;

    if (usd < MIN_USD) {
      setError("amount", { message: tv("min", { amount: MIN_USD.toFixed(4) }) });
      toast.error(tv("min", { amount: MIN_USD.toFixed(4) }));
      return;
    }
    if (usd > MAX_USD) {
      setError("amount", { message: tv("max", { amount: MAX_USD.toLocaleString("en-US") }) });
      toast.error(tv("max", { amount: MAX_USD.toLocaleString("en-US") }));
      return;
    }
    if (usd > DAILY_REMAINING_USD) {
      toast.error(tv("daily", { amount: DAILY_REMAINING_USD.toLocaleString("en-US") }));
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
    resetForm({ account: "", amount: "", fromCode: WALLETS[0].code, toCode: CURRENCIES[0].code });
    setNote("");
    setView("form");
  }

  const overviewRows = [
    { label: t("rows.sendingWallet"),     value: `${fromWallet.code} (${fromWallet.name})` },
    { label: t("rows.receivingWallet"),   value: `${toCurrency.code} (${toCurrency.name})` },
    { label: t("rows.account"),           value: account || "—" },
    { label: t("rows.enteredAmount"),     value: `${senderAmount.toFixed(4)} ${fromWallet.code}` },
    { label: t("rows.totalCharge"),       value: `${FIXED_CHARGE.toFixed(4)} ${fromWallet.code} + ${PERCENT_CHARGE.toFixed(4)}% = ${totalCharge.toFixed(4)} ${fromWallet.code}` },
    { label: t("rows.recipientReceived"), value: `${receiverAmt.toFixed(4)} ${toCurrency.code}` },
    { label: t("rows.totalPayable"),      value: `${totalPayable.toFixed(4)} ${fromWallet.code}`, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Left: form / overview / success */}
      <div className="glass rounded-2xl p-5">
        {view === "form" && (
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Form title */}
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Store className="size-4 text-primary" />
              </span>
              <p className="text-sm font-semibold">{tp("tabPayment")}</p>
            </div>

            <input type="hidden" {...register("fromCode")} />
            <input type="hidden" {...register("toCode")} />

            {/* Merchant */}
            <div className="space-y-2">
              <FieldLabel>{t("account")}</FieldLabel>
              <div
                className={cn(
                  "flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 transition-colors focus-within:ring-3 focus-within:ring-ring/50",
                  errors.account && "ring-2 ring-destructive",
                )}
              >
                <Store className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  inputMode="email"
                  placeholder={t("accountPlaceholder")}
                  value={account}
                  onChange={(e) => setValue("account", e.target.value, { shouldValidate: true })}
                  className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground md:text-sm"
                />
                <button
                  type="button"
                  onClick={qr.open}
                  className="shrink-0 rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={t("scanQr")}
                >
                  <ScanLine className="size-4" />
                </button>
              </div>
              {errors.account && (
                <p className="text-xs text-destructive">{errors.account.message}</p>
              )}
            </div>

            <AmountField
              label={t("senderAmount")}
              value={String(amount ?? "")}
              onChange={(v) => setValue("amount", v, { shouldValidate: true })}
              currency={fromWallet}
              options={WALLETS}
              onCurrencyChange={(w) => setValue("fromCode", w.code, { shouldValidate: true })}
              pickerHeading={t("selectWallet")}
              searchPlaceholder={t("search")}
              noResultsText={t("noCurrencies")}
              showBalance
              invalid={insufficientFunds || !!errors.amount}
            />

            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowUpDown className="size-3.5 text-primary" />
                <span dir="ltr">{rateLabel}</span>
              </div>
              <span className="h-px flex-1 bg-border" />
            </div>

            <AmountField
              label={t("receiverAmount")}
              value={receiverStr}
              currency={toCurrency}
              options={CURRENCIES}
              onCurrencyChange={(c) => setValue("toCode", c.code, { shouldValidate: true })}
              pickerHeading={t("selectCurrency")}
              searchPlaceholder={t("search")}
              noResultsText={t("noCurrencies")}
              readOnly
            />

            {errors.toCode && (
              <p className="text-xs text-destructive">{errors.toCode.message}</p>
            )}

            <textarea
              rows={2}
              placeholder={t("notePlaceholder")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full resize-none rounded-lg bg-muted/40 px-3 py-2.5 text-xs outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 md:text-sm"
            />

            <Button
              type="submit"
              size="lg"
              disabled={senderAmount <= 0 || !account.trim()}
              className="mt-2 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
            >
              {t("confirm")}
              <CreditCard className="ms-2 size-4" />
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
                {t("confirm")}
                <CreditCard className="ms-2 size-4" />
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
                  amount: `${senderAmount.toFixed(4)} ${fromWallet.code}`,
                  account: account || "—",
                })}
              </p>
            </div>
            <div className="w-full space-y-2 pt-2">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                <span className="text-xs text-muted-foreground md:text-sm">{t("rows.recipientReceived")}</span>
                <span className="text-xs font-semibold tabular-nums md:text-sm">
                  {receiverAmt.toFixed(4)} {toCurrency.code}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                <span className="text-xs text-muted-foreground md:text-sm">{t("rows.totalPayable")}</span>
                <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                  {totalPayable.toFixed(4)} {fromWallet.code}
                </span>
              </div>
            </div>
            <Button
              size="lg"
              className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
              onClick={reset}
            >
              {t("newAction")}
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

      <PinConfirmDialog
        isOpen={pinConfirm.isOpen}
        state={pinConfirm.state}
        error={pinConfirm.error}
        close={pinConfirm.close}
        submit={pinConfirm.submit}
        title={t("confirmTitle")}
        description={t("confirmDescription")}
      />

      <QrScannerDialog
        isOpen={qr.isOpen}
        close={qr.close}
        onScan={qr.onScan}
        onError={qr.onError}
      />
    </div>
  );
}
