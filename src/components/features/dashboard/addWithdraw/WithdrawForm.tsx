"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { createWithdrawSchema, type WithdrawFormValues } from "@/lib/validators/addWithdraw";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";
import {
  ADD_GATEWAYS,
  BALANCES,
  BalanceTypePicker,
  BigAmountField,
  CURRENCIES,
  FieldLabel,
  GatewayPicker,
  LimitPanel,
  SuccessView,
  TextField,
  WD_DAILY_REMAINING_USD,
  WD_FIXED_CHARGE,
  WD_LIMITS,
  WD_MAX_USD,
  WD_MIN_USD,
  WD_PERCENT_CHARGE,
  WITHDRAW_METHODS,
  type Balance,
} from "./shared";

type Step = "balance" | "gateway" | "amount" | "review";
type View = Step | "success";

const STEP_ORDER: Step[] = ["balance", "gateway", "amount", "review"];

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
    step === "balance"
      ? "stepBalance"
      : step === "gateway"
        ? "stepGateway"
        : step === "amount"
          ? "stepAmount"
          : "stepReview",
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
        {t("wdStepOf", { current: index, total: STEP_ORDER.length, step: stepLabel })}
      </p>
      <h2 className="mt-1 font-hero text-xl font-bold text-foreground">{question}</h2>
    </div>
  );
}

export function WithdrawForm() {
  const t = useTranslations("addWithdraw");
  const tv = useTranslations("addWithdraw.validation");

  const [view, setView] = useState<View>("balance");
  const [balance, setBalance] = useState<Balance>(BALANCES[0]);
  const [gateway, setGateway] = useState("");
  const [bankName, setBankName] = useState("");
  const [routingCode, setRoutingCode] = useState("");
  const [note, setNote] = useState("");

  const schema = useMemo(() => createWithdrawSchema(tv), [tv]);

  const {
    register, handleSubmit, watch, setValue, setError, reset: resetForm,
    formState: { errors },
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { method: "", amount: "", accountName: "", accountNumber: "" },
  });

  const method = String(watch("method") ?? "");
  const amount = String(watch("amount") ?? "");
  const accountName = String(watch("accountName") ?? "");
  const accountNumber = String(watch("accountNumber") ?? "");

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const parsed = parseFloat(amount) || 0;
  const totalCharge = WD_FIXED_CHARGE + (parsed * WD_PERCENT_CHARGE) / 100;
  const totalDeducted = parsed + totalCharge;
  const methodLabel = WITHDRAW_METHODS.find((m) => m.value === method)?.label ?? method;
  const selectedGateway = ADD_GATEWAYS.find((g) => g.value === gateway);
  const gatewayLabel = selectedGateway?.label ?? gateway;
  const balanceLabel = t(balance.kind === "spendable" ? "balanceSpendable" : "balanceInvestment");
  const BalanceIcon = balance.kind === "spendable" ? CreditCard : TrendingUp;
  const insufficientFunds = totalDeducted > 0 && totalDeducted > balance.balance;

  const onSubmit = handleSubmit((values) => {
    const amt = Number(values.amount) || 0;
    const usd = amt / balance.rate;
    if (usd < WD_MIN_USD) {
      setError("amount", { message: tv("min", { amount: WD_MIN_USD.toFixed(4) }) });
      toast.error(tv("min", { amount: WD_MIN_USD.toFixed(4) }));
      return;
    }
    if (usd > WD_MAX_USD) {
      setError("amount", { message: tv("max", { amount: WD_MAX_USD.toLocaleString("en-US") }) });
      toast.error(tv("max", { amount: WD_MAX_USD.toLocaleString("en-US") }));
      return;
    }
    if (usd > WD_DAILY_REMAINING_USD) {
      toast.error(tv("daily", { amount: WD_DAILY_REMAINING_USD.toLocaleString("en-US") }));
      return;
    }
    if (amt + totalCharge > balance.balance) {
      setError("amount", { message: tv("insufficient") });
      toast.error(tv("insufficient"));
      return;
    }
    setView("review");
  });

  function reset() {
    resetForm({ method: "", amount: "", accountName: "", accountNumber: "" });
    setGateway("");
    setBankName("");
    setRoutingCode("");
    setNote("");
    setView("balance");
  }

  const previewRows = [
    { label: t("rows.fromBalance"),   value: balanceLabel },
    { label: t("rows.gateway"),       value: gatewayLabel },
    { label: t("rows.method"),        value: methodLabel },
    { label: t("rows.accountName"),   value: accountName || "—" },
    { label: t("rows.accountNumber"), value: accountNumber || "—" },
    { label: t("rows.amount"),        value: `${parsed.toFixed(4)} ${balance.code}` },
    { label: t("rows.totalCharge"),   value: `${WD_FIXED_CHARGE.toFixed(4)} ${balance.code} + ${WD_PERCENT_CHARGE.toFixed(4)}% = ${totalCharge.toFixed(4)} ${balance.code}` },
  ];

  const isSuccess = view === "success";
  const detailsValid =
    parsed > 0 && !!gateway && !!method && accountName.trim() !== "" && accountNumber.trim() !== "" && !insufficientFunds;

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
              title={t("successWdTitle")}
              detail={t("successWdDetail", { amount: `${parsed.toFixed(4)} ${balance.code}` })}
              rows={[
                { label: t("rows.totalDeducted"), value: `${totalDeducted.toFixed(4)} ${balance.code}`, highlight: true },
                { label: t("rows.method"), value: methodLabel },
              ]}
              onReset={reset}
              resetLabel={t("newWithdraw")}
            />
          </div>
        ) : view === "review" ? (
          <div className="p-6 sm:p-8">
            <StepHeader step="review" question={t("reviewQuestion")} onBack={() => setView("amount")} />

            {/* Hero total card */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 px-6 py-5 text-center">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                {t("rows.totalDeducted")}
              </p>
              <p className="mt-2 font-hero text-4xl font-bold text-foreground sm:text-5xl">
                {balance.symbol}{totalDeducted.toFixed(2)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{methodLabel}</p>
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

            {/* Total deducted */}
            <div className="mt-2 flex items-center justify-between gap-4 pt-3">
              <span className="text-sm font-semibold text-foreground">{t("rows.totalDeducted")}</span>
              <span className="font-hero text-lg font-semibold text-primary">
                {totalDeducted.toFixed(4)} {balance.code}
              </span>
            </div>

            <Button
              size="lg"
              className="mt-5 h-13 w-full rounded-full [background:var(--gradient)] text-white hover:opacity-90"
              onClick={pinConfirm.open}
            >
              {t("withdraw")}
            </Button>
          </div>
        ) : view === "gateway" ? (
          <div className="p-6 sm:p-8">
            <StepHeader step="gateway" question={t("gatewayQuestion")} onBack={() => setView("balance")} />

            <GatewayPicker
              value={gateway}
              onChange={setGateway}
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
        ) : view === "amount" ? (
          <form onSubmit={onSubmit} className="p-6 sm:p-8">
            <StepHeader step="amount" question={t("amountQuestion")} onBack={() => setView("gateway")} />

            {/* Selected balance + gateway chips */}
            <div className="mb-6 space-y-2.5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    balance.kind === "spendable" ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-500",
                  )}>
                    <BalanceIcon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{t("withdrawingFrom")}</p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {balanceLabel} · {balance.symbol}{balance.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setView("balance")}
                  className="shrink-0 text-xs font-semibold text-primary hover:underline"
                >
                  {t("changeBalance")}
                </button>
              </div>

              {selectedGateway && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
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
            </div>

            <BigAmountField
              label={t("youWithdraw")}
              value={amount}
              onChange={(v) => setValue("amount", v, { shouldValidate: true })}
              currency={CURRENCIES[0]}
              onCurrencyChange={() => {}}
              invalid={insufficientFunds || !!errors.amount}
            />
            {(errors.amount || insufficientFunds) && (
              <p className="mt-2 text-center text-xs text-destructive">
                {errors.amount?.message ?? `${tv("insufficient")} ${balance.symbol}${balance.balance.toFixed(2)}`}
              </p>
            )}

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <FieldLabel>{t("withdrawalMethod")}</FieldLabel>
                <input type="hidden" {...register("method")} />
                <Select value={method} onValueChange={(v) => setValue("method", v, { shouldValidate: true })}>
                  <SelectTrigger className={cn("h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm", errors.method && "ring-2 ring-destructive")}>
                    <SelectValue placeholder={t("selectMethod")} />
                  </SelectTrigger>
                  <SelectContent>
                    {WITHDRAW_METHODS.map((m) => (
                      <SelectItem key={m.value} value={m.value} className="ps-3 py-2.5"><span className="me-2">{m.icon}</span>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.method && <p className="text-xs text-destructive">{errors.method.message}</p>}
              </div>

              <div>
                <input type="hidden" {...register("accountName")} />
                <TextField label={t("accountName")} placeholder={t("accountNamePlaceholder")} value={accountName} onChange={(v) => setValue("accountName", v, { shouldValidate: true })} invalid={!!errors.accountName} />
                {errors.accountName && <p className="mt-1 text-xs text-destructive">{errors.accountName.message}</p>}
              </div>

              <div>
                <input type="hidden" {...register("accountNumber")} />
                <TextField label={t("accountNumber")} placeholder={t("accountNumberPlaceholder")} value={accountNumber} onChange={(v) => setValue("accountNumber", v, { shouldValidate: true })} dir="ltr" invalid={!!errors.accountNumber} />
                {errors.accountNumber && <p className="mt-1 text-xs text-destructive">{errors.accountNumber.message}</p>}
              </div>

              <TextField label={t("bankName")}    placeholder={t("bankNamePlaceholder")}    value={bankName}    onChange={setBankName} />
              <TextField label={t("routingCode")} placeholder={t("routingCodePlaceholder")} value={routingCode} onChange={setRoutingCode} dir="ltr" />
            </div>

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
                  {balance.symbol}{totalCharge.toFixed(2)}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!detailsValid}
              className="mt-7 h-14 w-full rounded-full text-[16px] font-bold [background:var(--gradient)] text-white transition-transform hover:-translate-y-0.5 hover:opacity-95 disabled:translate-y-0 disabled:opacity-50"
            >
              {t("preview")}
            </Button>
          </form>
        ) : (
          <div className="p-6 sm:p-8">
            <StepHeader step="balance" question={t("balanceQuestion")} />

            <BalanceTypePicker
              value={balance.kind}
              onChange={setBalance}
              onSelect={() => setView("gateway")}
            />

            <Button
              type="button"
              onClick={() => setView("gateway")}
              className="mt-6 hidden h-13 w-full rounded-full text-[15px] font-bold [background:var(--gradient)] text-white transition-transform hover:-translate-y-0.5 hover:opacity-95 sm:flex"
            >
              {t("continue")}
            </Button>
          </div>
        )}
      </div>

      {!isSuccess && <LimitPanel limits={WD_LIMITS} />}

      <PinConfirmDialog
        isOpen={pinConfirm.isOpen}
        state={pinConfirm.state}
        error={pinConfirm.error}
        close={pinConfirm.close}
        submit={pinConfirm.submit}
        title={t("confirmWdTitle")}
        description={t("confirmWdDescription")}
      />
    </div>
  );
}
