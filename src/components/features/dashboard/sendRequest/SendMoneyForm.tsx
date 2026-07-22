"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, ArrowLeftRight, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { createSendSchema, type SendFormValues } from "@/lib/validators/send";
import { Button } from "@/components/ui/button";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";
import {
  BigAmountInput,
  CURRENCIES,
  FieldLabel,
  FIXED_CHARGE,
  PERCENT_CHARGE,
  RecipientField,
  SEND_DAILY_REMAINING_USD,
  SEND_MAX_USD,
  SEND_MIN_USD,
  type Currency,
} from "./shared";

type Step = "recipient" | "amount" | "review";
type View = Step | "success";

const STEP_ORDER: Step[] = ["recipient", "amount", "review"];

// White glass card matching the send-money design.
const CARD = "relative overflow-hidden rounded-3xl border border-border bg-card";

function StepHeader({
  step,
  question,
  onBack,
}: {
  step: Step;
  question: string;
  onBack?: () => void;
}) {
  const t = useTranslations("sendRequest");
  const index = STEP_ORDER.indexOf(step) + 1;
  const stepLabel = t(
    step === "recipient" ? "stepRecipient" : step === "amount" ? "stepAmount" : "stepReview",
  );

  return (
    <div className="mb-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          {t("back")}
        </button>
      )}
      <p className="text-xs text-muted-foreground">
        {t("stepOf", { current: index, total: STEP_ORDER.length, step: stepLabel })}
      </p>
      <h2 className="mt-1 font-hero text-xl font-bold text-foreground">{question}</h2>
    </div>
  );
}

export function SendMoneyForm() {
  const t = useTranslations("sendRequest");
  const tv = useTranslations("sendRequest.validation");

  const [view, setView] = useState<View>("recipient");
  const [sendCurrency, setSendCurrency] = useState<Currency>(CURRENCIES[0]);
  const [recvCurrency, setRecvCurrency] = useState<Currency>(CURRENCIES[1]);
  const [note, setNote] = useState("");

  const schema = useMemo(() => createSendSchema(tv), [tv]);

  const {
    register, handleSubmit, watch, setValue, setError, trigger, reset: resetForm,
    formState: { errors },
  } = useForm<SendFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { recipient: "", amount: "" },
  });

  const recipient = String(watch("recipient") ?? "");
  const amount = String(watch("amount") ?? "");

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const exchangeRate = recvCurrency.rate / sendCurrency.rate;
  const parsed = parseFloat(amount) || 0;
  const recvAmount = parsed > 0 ? (parsed * exchangeRate).toFixed(2) : "";
  const totalCharge = FIXED_CHARGE + (parsed * PERCENT_CHARGE) / 100;
  const totalPayable = parsed + totalCharge;
  const rateLabel = `1 ${sendCurrency.code} = ${exchangeRate.toFixed(4)} ${recvCurrency.code}`;

  function swapCurrencies() {
    setSendCurrency(recvCurrency);
    setRecvCurrency(sendCurrency);
  }

  async function continueFromRecipient() {
    const ok = await trigger("recipient");
    if (ok) setView("amount");
  }

  const onSubmitAmount = handleSubmit((values) => {
    const amt = Number(values.amount) || 0;
    const usd = amt / sendCurrency.rate;
    if (usd < SEND_MIN_USD) {
      setError("amount", { message: tv("min", { amount: SEND_MIN_USD.toFixed(4) }) });
      toast.error(tv("min", { amount: SEND_MIN_USD.toFixed(4) }));
      return;
    }
    if (usd > SEND_MAX_USD) {
      setError("amount", { message: tv("max", { amount: SEND_MAX_USD.toLocaleString("en-US") }) });
      toast.error(tv("max", { amount: SEND_MAX_USD.toLocaleString("en-US") }));
      return;
    }
    if (usd > SEND_DAILY_REMAINING_USD) {
      toast.error(tv("daily", { amount: SEND_DAILY_REMAINING_USD.toLocaleString("en-US") }));
      return;
    }
    setView("review");
  });

  function reset() {
    resetForm({ recipient: "", amount: "" });
    setNote("");
    setView("recipient");
  }

  const rows = [
    { label: t("rows.sendingWallet"),   value: `${sendCurrency.code} (${sendCurrency.name})` },
    { label: t("rows.receivingWallet"), value: `${recvCurrency.code} (${recvCurrency.name})` },
    { label: t("rows.recipient"),       value: recipient || "—" },
    { label: t("rows.enteredAmount"),   value: `${parsed.toFixed(4)} ${sendCurrency.code}` },
    { label: t("rows.totalCharge"),     value: `${FIXED_CHARGE.toFixed(4)} ${sendCurrency.code} + ${PERCENT_CHARGE.toFixed(4)}% = ${totalCharge.toFixed(4)} ${sendCurrency.code}` },
  ];

  const isSuccess = view === "success";

  return (
    <div
      className={cn(
        "gap-6",
        isSuccess
          ? "mx-auto w-full max-w-xl"
          : "grid grid-cols-1 items-start lg:grid-cols-[1.4fr_1fr]",
      )}
    >
      {/* ─── Main card ─────────────────────────────────────────────── */}
      <div className={CARD}>
        {view === "recipient" && (
          <div className="p-6 sm:p-8">
            <StepHeader step="recipient" question={t("recipientQuestion")} />

            <input type="hidden" {...register("recipient")} />
            <RecipientField
              label={t("sendTo")}
              value={recipient}
              onChange={(v) => setValue("recipient", v, { shouldValidate: true })}
              invalid={!!errors.recipient}
            />
            {errors.recipient ? (
              <p className="mt-2 text-xs text-destructive">{errors.recipient.message}</p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">{t("recipientHelper")}</p>
            )}

            <Button
              type="button"
              disabled={!recipient.trim()}
              onClick={continueFromRecipient}
              className="mt-6 h-13 w-full rounded-full text-[15px] font-bold [background:var(--gradient)] text-white shadow-[0_16px_40px_-12px_hsl(var(--primary)/0.6)] transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:opacity-50"
            >
              {t("continue")}
            </Button>
          </div>
        )}

        {view === "amount" && (
          <form onSubmit={onSubmitAmount} className="p-6 sm:p-8">
            <StepHeader
              step="amount"
              question={t("amountQuestion")}
              onBack={() => setView("recipient")}
            />

            {/* Amount composer */}
            <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
              <BigAmountInput
                label={t("youSend")}
                value={amount}
                onChange={(v) => setValue("amount", v, { shouldValidate: true })}
                currency={sendCurrency}
                onCurrencyChange={setSendCurrency}
                pickerHeading={t("sendFrom")}
              />

              <button
                type="button"
                onClick={swapCurrencies}
                aria-label={t("swap")}
                className="mx-auto grid size-14 shrink-0 place-items-center rounded-full border border-primary/25 bg-card text-primary shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.5)] transition-transform duration-500 hover:rotate-180 hover:[background:var(--gradient)] hover:text-white"
              >
                <ArrowLeftRight className="size-5" />
              </button>

              <BigAmountInput
                label={t("recipientGets")}
                value={recvAmount}
                readOnly
                accent
                currency={recvCurrency}
                onCurrencyChange={setRecvCurrency}
                pickerHeading={t("sendFrom")}
                subtext={t("arrivesInstantly")}
              />
            </div>
            {errors.amount && (
              <p className="mt-2 text-center text-xs text-destructive">{errors.amount.message}</p>
            )}

            {/* Rate bezel */}
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3.5">
              <span className="size-2 rounded-full bg-primary" />
              <span dir="ltr" className="font-mono text-[13px] font-medium text-primary">
                {rateLabel}
              </span>
              <span className="flex-1" />
              <span className="text-xs text-muted-foreground">
                {t("currentRate")}
              </span>
            </div>

            {/* Note + fee */}
            <div className="mt-6 grid grid-cols-1 items-start gap-5 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <FieldLabel>{t("noteOptional")}</FieldLabel>
                <input
                  type="text"
                  placeholder={t("note")}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-11 w-full rounded-full border border-border bg-muted/40 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
                />
              </div>
              <div className="text-end">
                <FieldLabel>{t("fees")}</FieldLabel>
                <div className="mt-1 font-hero text-[26px] text-primary">
                  {sendCurrency.symbol}{totalCharge.toFixed(2)}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={parsed <= 0}
              className="mt-7 h-14 w-full rounded-full text-[16px] font-bold [background:var(--gradient)] text-white transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:opacity-50"
            >
              {t("continue")}
            </Button>
          </form>
        )}

        {view === "review" && (
          <div className="p-6 sm:p-8">
            <StepHeader
              step="review"
              question={t("reviewQuestion")}
              onBack={() => setView("amount")}
            />

            {/* Hero receive card */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 px-6 py-5 text-center">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                {t("rows.recipientReceived")}
              </p>
              <p className="mt-2 font-hero text-4xl font-bold text-foreground sm:text-5xl">
                {recvCurrency.symbol}{(parsed * exchangeRate).toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("toRecipient", { recipient: recipient || "—" })}
              </p>
            </div>

            {/* Detail rows */}
            <div className="mt-6">
              {rows.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{label}</span>
                  <span className="text-end text-xs font-medium tabular-nums md:text-sm">{value}</span>
                </div>
              ))}
            </div>

            {/* Total charged */}
            <div className="mt-2 flex items-center justify-between gap-4 pt-3">
              <span className="text-sm font-semibold text-foreground">{t("rows.totalPayable")}</span>
              <span className="font-hero text-lg font-semibold text-primary">
                {totalPayable.toFixed(4)} {sendCurrency.code}
              </span>
            </div>

            <Button
              size="lg"
              className="mt-5 h-13 w-full rounded-full [background:var(--gradient)] text-white hover:opacity-90"
              onClick={pinConfirm.open}
            >
              {t("sendMoney")}
            </Button>
          </div>
        )}

        {view === "success" && (
          <div className="flex flex-col items-center gap-4 p-6 py-10 text-center sm:p-8">
            <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-9 text-emerald-500" />
            </span>
            <div className="space-y-1">
              <p className="font-hero text-xl font-bold">{t("successTitleSend")}</p>
              <p className="text-sm text-muted-foreground">
                {t("successDetailSend", { amount: `${parsed.toFixed(4)} ${sendCurrency.code}`, recipient })}
              </p>
            </div>
            <div className="w-full space-y-2 pt-2">
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-muted-foreground md:text-sm">{t("rows.recipientReceived")}</span>
                <span className="text-xs font-semibold tabular-nums md:text-sm">{(parsed * exchangeRate).toFixed(4)} {recvCurrency.code}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-muted-foreground md:text-sm">{t("rows.totalPayable")}</span>
                <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">{totalPayable.toFixed(4)} {sendCurrency.code}</span>
              </div>
            </div>
            <Button size="lg" className="mt-2 h-11 w-full rounded-full [background:var(--gradient)] text-white hover:opacity-90" onClick={reset}>
              {t("newTransfer")}
            </Button>
          </div>
        )}
      </div>

      {/* ─── Right column (hidden on success) ──────────────────────── */}
      {!isSuccess && (
      <div className="flex flex-col gap-6">
        {/* Limitations — ring meter + limit rows */}
        <div className={cn(CARD, "p-6")}>
          <div className="mb-5">
            <span className="font-hero text-xl font-bold text-foreground">{t("limitationsTitle")}</span>
          </div>

          <div className="space-y-2">
            <div className="rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-muted-foreground">{t("limits.transactionLimit")}</span>
                <span className="text-[13px] font-medium text-foreground">10 – 1,000 USD</span>
              </div>
            </div>
            <div className="rounded-xl  px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-muted-foreground">{t("limits.dailyLimit")}</span>
                <span className="text-[13px] font-medium text-foreground">10,000 USD</span>
              </div>
              <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-border">
                <div className="h-full w-[3%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-muted-foreground">{t("limits.monthlyLimit")}</span>
                <span className="text-[13px] font-medium text-foreground">50,000 USD</span>
              </div>
            </div>
            <div className="rounded-xl bg-primary/8 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] font-semibold text-primary">{t("limits.remainingDaily")}</span>
                <span className="text-sm font-semibold text-primary">$9,700</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

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
