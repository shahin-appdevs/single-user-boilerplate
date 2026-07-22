"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, ArrowUpDown, CheckCircle2, ReceiptText } from "lucide-react";

import { cn } from "@/lib/utils";
import { createSendSchema, type SendFormValues } from "@/lib/validators/send";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CURRENCIES,
  CurrencyInput,
  FieldLabel,
  FIXED_CHARGE,
  GATEWAYS,
  LimitPanel,
  PERCENT_CHARGE,
  RecipientField,
  SEND_DAILY_REMAINING_USD,
  SEND_MAX_USD,
  SEND_MIN_USD,
  type Currency,
} from "./shared";

type View = "form" | "preview" | "success";

export function RequestMoneyForm() {
  const t = useTranslations("sendRequest");
  const tv = useTranslations("sendRequest.validation");

  const [view, setView] = useState<View>("form");
  const [sendCurrency, setSendCurrency] = useState<Currency>(CURRENCIES[0]);
  const [recvCurrency, setRecvCurrency] = useState<Currency>(CURRENCIES[1]);
  const [gateway, setGateway] = useState("");
  const [note, setNote] = useState("");

  const schema = useMemo(() => createSendSchema(tv), [tv]);

  const {
    register, handleSubmit, watch, setValue, setError, reset: resetForm,
    formState: { errors },
  } = useForm<SendFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { recipient: "", amount: "" },
  });

  const recipient = String(watch("recipient") ?? "");
  const amount = String(watch("amount") ?? "");

  const exchangeRate = recvCurrency.rate / sendCurrency.rate;
  const parsed = parseFloat(amount) || 0;
  const recvAmount = parsed > 0 ? (parsed * exchangeRate).toFixed(2) : "";
  const totalCharge = FIXED_CHARGE + (parsed * PERCENT_CHARGE) / 100;
  const totalPayable = parsed + totalCharge;
  const rateLabel = `1 ${sendCurrency.code} = ${exchangeRate.toFixed(4)} ${recvCurrency.code}`;

  const onSubmit = handleSubmit((values) => {
    if (!gateway) { toast.error(tv("gatewayRequired")); return; }
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
    setView("preview");
  });

  function reset() {
    resetForm({ recipient: "", amount: "" });
    setGateway("");
    setNote("");
    setView("form");
  }

  const rows = [
    { label: t("rows.requestingWallet"), value: `${sendCurrency.code} (${sendCurrency.name})` },
    { label: t("rows.receivingWallet"),  value: `${recvCurrency.code} (${recvCurrency.name})` },
    { label: t("rows.requestFrom"),      value: recipient || "—" },
    { label: t("rows.enteredAmount"),    value: `${parsed.toFixed(4)} ${sendCurrency.code}` },
    { label: t("rows.totalCharge"),      value: `${FIXED_CHARGE.toFixed(4)} ${sendCurrency.code} + ${PERCENT_CHARGE.toFixed(4)}% = ${totalCharge.toFixed(4)} ${sendCurrency.code}` },
    { label: t("rows.recipientReceived"), value: `${(parsed * exchangeRate).toFixed(4)} ${recvCurrency.code}` },
    { label: t("rows.totalPayable"),     value: `${totalPayable.toFixed(4)} ${sendCurrency.code}`, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="glass rounded-2xl p-5">
        {view === "form" && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <ReceiptText className="size-4 text-primary" />
              </span>
              <p className="text-sm font-semibold">{t("requestMoney")}</p>
            </div>
            <input type="hidden" {...register("recipient")} />

            <div className="space-y-2">
              <FieldLabel>{t("gateway")}</FieldLabel>
              <Select value={gateway} onValueChange={setGateway}>
                <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                  <SelectValue placeholder={t("selectGateway")} />
                </SelectTrigger>
                <SelectContent>
                  {GATEWAYS.map((g) => (
                    <SelectItem key={g.value} value={g.value} className="ps-3 py-2.5">{g.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <RecipientField
              label={t("requestFrom")}
              value={recipient}
              onChange={(v) => setValue("recipient", v, { shouldValidate: true })}
              invalid={!!errors.recipient}
            />
            {errors.recipient && <p className="text-xs text-destructive">{errors.recipient.message}</p>}

            <div className="space-y-3">
              <div className="space-y-2">
                <FieldLabel>{t("youRequest")}</FieldLabel>
                <CurrencyInput
                  value={amount}
                  onChange={(v) => setValue("amount", v, { shouldValidate: true })}
                  currency={sendCurrency}
                  onCurrencyChange={setSendCurrency}
                  pickerHeading={t("sendFrom")}
                  invalid={!!errors.amount}
                />
                {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowUpDown className="size-3.5 text-primary" />
                  <span dir="ltr">{rateLabel}</span>
                </div>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-2">
                <FieldLabel>{t("theySend")}</FieldLabel>
                <CurrencyInput value={recvAmount} readOnly currency={recvCurrency} onCurrencyChange={setRecvCurrency} pickerHeading={t("sendFrom")} />
              </div>
            </div>

            <textarea
              rows={2}
              placeholder={t("note")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full resize-none rounded-lg bg-muted/40 px-3 py-2.5 text-xs outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50 md:text-sm"
            />

            <Button type="submit" size="lg" disabled={parsed <= 0 || !recipient.trim()} className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50">
              {t("requestMoney")}
              <ReceiptText className="ms-2 size-4" />
            </Button>
          </form>
        )}

        {view === "preview" && (
          <div className="space-y-4">
            <p className="text-base font-bold">{t("overviewTitle")}</p>
            <div className="space-y-2">
              {rows.map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className={cn("shrink-0 text-xs text-muted-foreground md:text-sm", highlight && "font-semibold text-foreground")}>{label}</span>
                  <span className={cn("text-end text-xs font-medium tabular-nums md:text-sm", highlight && "font-semibold text-primary")}>{value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" className="h-11 flex-1" onClick={() => setView("form")}>
                <ArrowLeft className="me-2 size-4 rtl:rotate-180" />
                {t("back")}
              </Button>
              <Button size="lg" className="h-11 flex-1 [background:var(--gradient)] text-white hover:opacity-90" onClick={() => setView("success")}>
                {t("requestMoney")}
                <ReceiptText className="ms-2 size-4" />
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
              <p className="text-lg font-bold">{t("successTitleRequest")}</p>
              <p className="text-sm text-muted-foreground">
                {t("successDetailRequest", { amount: `${parsed.toFixed(4)} ${sendCurrency.code}`, recipient })}
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
            <Button size="lg" className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90" onClick={reset}>
              {t("newRequest")}
            </Button>
          </div>
        )}
      </div>

      <LimitPanel />
    </div>
  );
}
