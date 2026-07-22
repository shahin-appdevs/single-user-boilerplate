"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { createAddSchema, type AddFormValues } from "@/lib/validators/addWithdraw";
import { Button } from "@/components/ui/button";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";
import {
  ADD_DAILY_REMAINING_USD,
  ADD_FIXED_CHARGE,
  ADD_GATEWAYS,
  ADD_LIMITS,
  ADD_MAX_USD,
  ADD_MIN_USD,
  ADD_PERCENT_CHARGE,
  BigAmountField,
  CURRENCIES,
  FieldLabel,
  GatewayPicker,
  LimitPanel,
  SuccessView,
  type Currency,
} from "./shared";

type Step = "gateway" | "amount" | "review";
type View = Step | "success";

const STEP_ORDER: Step[] = ["gateway", "amount", "review"];

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
  const t = useTranslations("addWithdraw");
  const index = STEP_ORDER.indexOf(step) + 1;
  const stepLabel = t(
    step === "gateway" ? "stepGateway" : step === "amount" ? "stepAmount" : "stepReview",
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

export function AddMoneyForm() {
  const t = useTranslations("addWithdraw");
  const tv = useTranslations("addWithdraw.validation");

  const [view, setView] = useState<View>("gateway");
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
  const [note, setNote] = useState("");

  const schema = useMemo(() => createAddSchema(tv), [tv]);

  const {
    register, handleSubmit, watch, setValue, setError, reset: resetForm,
    formState: { errors },
  } = useForm<AddFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { gateway: "", amount: "" },
  });

  const gateway = String(watch("gateway") ?? "");
  const amount = String(watch("amount") ?? "");

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const parsed = parseFloat(amount) || 0;
  const totalCharge = ADD_FIXED_CHARGE + (parsed * ADD_PERCENT_CHARGE) / 100;
  const totalPayable = parsed + totalCharge;
  const selectedGateway = ADD_GATEWAYS.find((g) => g.value === gateway);
  const gatewayLabel = selectedGateway?.label ?? gateway;
  const convertedRate = 1 / currency.rate;
  const convertedAmount = parsed > 0 ? (parsed * convertedRate).toFixed(4) : "";
  const rateLabel = `1 USD = ${convertedRate.toFixed(4)} ${currency.code}`;

  const onSubmit = handleSubmit((values) => {
    const amt = Number(values.amount) || 0;
    const usd = amt / currency.rate;
    if (usd < ADD_MIN_USD) {
      setError("amount", { message: tv("min", { amount: ADD_MIN_USD.toFixed(4) }) });
      toast.error(tv("min", { amount: ADD_MIN_USD.toFixed(4) }));
      return;
    }
    if (usd > ADD_MAX_USD) {
      setError("amount", { message: tv("max", { amount: ADD_MAX_USD.toLocaleString("en-US") }) });
      toast.error(tv("max", { amount: ADD_MAX_USD.toLocaleString("en-US") }));
      return;
    }
    if (usd > ADD_DAILY_REMAINING_USD) {
      toast.error(tv("daily", { amount: ADD_DAILY_REMAINING_USD.toLocaleString("en-US") }));
      return;
    }
    setView("review");
  });

  function reset() {
    resetForm({ gateway: "", amount: "" });
    setNote("");
    setView("gateway");
  }

  const previewRows = [
    { label: t("rows.gateway"),     value: gatewayLabel },
    { label: t("rows.wallet"),      value: `${currency.code} (${currency.name})` },
    { label: t("rows.amount"),      value: `${parsed.toFixed(4)} ${currency.code}` },
    { label: t("rows.totalCharge"), value: `${ADD_FIXED_CHARGE.toFixed(4)} ${currency.code} + ${ADD_PERCENT_CHARGE.toFixed(4)}% = ${totalCharge.toFixed(4)} ${currency.code}` },
  ];

  const isSuccess = view === "success";

  return (
    <div
      className={cn(
        "gap-6",
        isSuccess ? "mx-auto w-full max-w-xl" : "grid grid-cols-1 items-start lg:grid-cols-[1.4fr_1fr]",
      )}
    >
      <div className={CARD}>
        {view === "success" ? (
          <div className="p-6 sm:p-8">
            <SuccessView
              title={t("successAddTitle")}
              detail={t("successAddDetail", { amount: `${parsed.toFixed(4)} ${currency.code}` })}
              rows={[
                { label: t("rows.totalPayable"), value: `${totalPayable.toFixed(4)} ${currency.code}`, highlight: true },
                { label: t("rows.gateway"), value: gatewayLabel },
              ]}
              onReset={reset}
              resetLabel={t("newAdd")}
            />
          </div>
        ) : view === "review" ? (
          <div className="p-6 sm:p-8">
            <StepHeader step="review" question={t("reviewQuestion")} onBack={() => setView("amount")} />

            {/* Hero total card */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 px-6 py-5 text-center">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                {t("rows.totalPayable")}
              </p>
              <p className="mt-2 font-hero text-4xl font-bold text-foreground sm:text-5xl">
                {currency.symbol}{totalPayable.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{gatewayLabel}</p>
            </div>

            {/* Detail rows */}
            <div className="mt-6">
              {previewRows.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{label}</span>
                  <span className="text-end text-xs font-medium tabular-nums md:text-sm">{value}</span>
                </div>
              ))}
            </div>

            {/* Total payable */}
            <div className="mt-2 flex items-center justify-between gap-4 pt-3">
              <span className="text-sm font-semibold text-foreground">{t("rows.totalPayable")}</span>
              <span className="font-hero text-lg font-semibold text-primary">
                {totalPayable.toFixed(4)} {currency.code}
              </span>
            </div>

            <Button
              size="lg"
              className="mt-5 h-13 w-full rounded-full [background:var(--gradient)] text-white hover:opacity-90"
              onClick={pinConfirm.open}
            >
              {t("addMoney")}
            </Button>
          </div>
        ) : view === "amount" ? (
          <form onSubmit={onSubmit} className="p-6 sm:p-8">
            <StepHeader step="amount" question={t("amountQuestion")} onBack={() => setView("gateway")} />

            <input type="hidden" {...register("gateway")} />
            {selectedGateway && (
              <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-sm", selectedGateway.iconBg)}>
                    {selectedGateway.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{t("payingWith")}</p>
                    <p className="truncate text-sm font-semibold text-foreground">{selectedGateway.label}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setView("gateway")}
                  className="shrink-0 text-xs font-semibold text-primary hover:underline"
                >
                  {t("changeGateway")}
                </button>
              </div>
            )}

            <div>
              <BigAmountField
                label={t("youAdd")}
                value={amount}
                onChange={(v) => setValue("amount", v, { shouldValidate: true })}
                currency={currency}
                onCurrencyChange={setCurrency}
                invalid={!!errors.amount}
              />
            </div>
            {errors.amount && <p className="mt-2 text-center text-xs text-destructive">{errors.amount.message}</p>}

            {currency.code !== "USD" && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3.5">
                  <ArrowUpDown className="size-4 shrink-0 text-primary" />
                  <span dir="ltr" className="font-mono text-[13px] font-medium text-primary">{rateLabel}</span>
                </div>
                <BigAmountField
                  label={t("youReceive")}
                  value={convertedAmount}
                  readOnly
                  accent
                  currency={CURRENCIES[0]}
                  onCurrencyChange={() => {}}
                />
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 items-start gap-5 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <FieldLabel>{t("note")}</FieldLabel>
                <textarea
                  rows={2}
                  placeholder={t("notePlaceholder")}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs outline-none placeholder:text-muted-foreground focus:border-primary md:text-sm"
                />
              </div>
              <div className="text-end">
                <FieldLabel>{t("fees")}</FieldLabel>
                <div className="mt-1 font-hero text-[26px] text-primary">
                  {currency.symbol}{totalCharge.toFixed(2)}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={parsed <= 0 || !gateway}
              className="mt-7 h-14 w-full rounded-full text-[16px] font-bold [background:var(--gradient)] text-white transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:opacity-50"
            >
              {t("preview")}
            </Button>
          </form>
        ) : (
          <div className="p-6 sm:p-8">
            <StepHeader step="gateway" question={t("gatewayQuestion")} />

            <GatewayPicker
              value={gateway}
              onChange={(v) => setValue("gateway", v, { shouldValidate: true })}
              onSelect={() => setView("amount")}
            />

            <Button
              type="button"
              disabled={!gateway}
              onClick={() => setView("amount")}
              className="mt-6 hidden h-13 w-full rounded-full text-[15px] font-bold [background:var(--gradient)] text-white transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:opacity-50 sm:flex"
            >
              {t("continue")}
            </Button>
          </div>
        )}
      </div>

      {!isSuccess && <LimitPanel limits={ADD_LIMITS} />}

      <PinConfirmDialog
        isOpen={pinConfirm.isOpen}
        state={pinConfirm.state}
        error={pinConfirm.error}
        close={pinConfirm.close}
        submit={pinConfirm.submit}
        title={t("confirmAddTitle")}
        description={t("confirmAddDescription")}
      />
    </div>
  );
}
