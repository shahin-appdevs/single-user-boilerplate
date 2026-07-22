"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Info, Smartphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { createManualTopUpSchema, type ManualTopUpFormValues } from "@/lib/validators/topUp";
import { findCountry } from "@/constants/countries";
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
import { AmountField, FieldLabel, WALLETS } from "../payOut/shared";
import { PhoneInput } from "./PhoneInput";

type View = "form" | "overview" | "success";

const OPERATORS = [
  { value: "mobile-garage", label: "Mobile Garage" },
  { value: "grameenphone",  label: "Grameenphone"  },
  { value: "robi",          label: "Robi"          },
  { value: "banglalink",    label: "Banglalink"    },
  { value: "airtel",        label: "Airtel"        },
] as const;

const FIXED_CHARGE   = 0;
const PERCENT_CHARGE = 0;

const MIN_USD = 15;
const MAX_USD = 1000;
const DAILY_REMAINING_USD = 100;

const LIMITS = [
  { key: "transactionLimit", value: "15.0000 USD - 1,000.0000 USD" },
  { key: "dailyLimit",       value: "100.0000 USD"                 },
  { key: "remainingDaily",   value: "100.0000 USD"                 },
  { key: "monthlyLimit",     value: "1,000.0000 USD"               },
  { key: "remainingMonthly", value: "1,000.0000 USD"               },
] as const;

export function ManualTopUpForm() {
  const t = useTranslations("topUp");
  const tv = useTranslations("topUp.validation");

  const [view, setView] = useState<View>("form");

  const schema = useMemo(() => createManualTopUpSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<ManualTopUpFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      operator: OPERATORS[0].value,
      country: "BD",
      mobile: "",
      amount: "",
      payCode: WALLETS[0].code,
    },
  });

  const operator = watch("operator");
  const country = watch("country");
  const mobile = String(watch("mobile") ?? "");
  const amount = watch("amount");
  const payCode = watch("payCode");

  const payWallet = WALLETS.find((w) => w.code === payCode) ?? WALLETS[0];
  const dial = findCountry(country).dial;

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const senderAmount = parseFloat(String(amount)) || 0;
  const totalCharge  = FIXED_CHARGE + (senderAmount * PERCENT_CHARGE) / 100;
  const totalPayable = senderAmount + totalCharge;
  const insufficientFunds = totalPayable > 0 && totalPayable > payWallet.balance;
  const rateLabel = `1 ${payWallet.code} = 1.0000 ${payWallet.code}`;

  const operatorLabel = OPERATORS.find((o) => o.value === operator)?.label ?? "—";
  const mobileLabel = mobile ? `${dial} ${mobile}` : "—";

  const onSubmit = handleSubmit((values) => {
    const amt = Number(values.amount) || 0;
    const usd = amt / payWallet.rate;

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
    if (amt + totalCharge > payWallet.balance) {
      setError("amount", { message: tv("insufficient") });
      toast.error(tv("insufficient"));
      return;
    }
    setView("overview");
  });

  function reset() {
    resetForm({ operator: OPERATORS[0].value, country: "BD", mobile: "", amount: "", payCode: WALLETS[0].code });
    setView("form");
  }

  const overviewRows = [
    { label: t("rows.sendingWallet"), value: `${payWallet.code} (${payWallet.name})` },
    { label: t("rows.topUpType"),     value: operatorLabel },
    { label: t("rows.mobileNumber"),  value: mobileLabel },
    { label: t("rows.amount"),        value: `${senderAmount.toFixed(4)} ${payWallet.code}` },
    { label: t("rows.totalCharge"),   value: `${totalCharge.toFixed(4)} ${payWallet.code}` },
    { label: t("rows.totalPayable"),  value: `${totalPayable.toFixed(4)} ${payWallet.code}`, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Left: form / overview / success */}
      <div className="glass rounded-2xl p-5">
        {view === "form" && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Smartphone className="size-4 text-primary" />
              </span>
              <p className="text-sm font-semibold">{t("recharge")}</p>
            </div>

            <input type="hidden" {...register("operator")} />
            <input type="hidden" {...register("payCode")} />
            <input type="hidden" {...register("mobile")} />

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground" dir="ltr">{rateLabel}</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-4">
              {/* Operator */}
              <div className="space-y-2">
                <FieldLabel>{t("topUpType")}</FieldLabel>
                <Select value={operator} onValueChange={(v) => setValue("operator", v, { shouldValidate: true })}>
                  <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((o) => (
                      <SelectItem key={o.value} value={o.value} className="ps-3 py-2.5">{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile number */}
              <div className="space-y-2">
                <FieldLabel>{t("mobileNumber")}</FieldLabel>
                <PhoneInput
                  country={country}
                  onCountryChange={(c) => setValue("country", c, { shouldValidate: true })}
                  value={mobile}
                  onChange={(v) => setValue("mobile", v, { shouldValidate: true })}
                  placeholder={t("mobilePlaceholder")}
                  invalid={!!errors.mobile}
                />
              </div>
            </div>

            {/* Amount */}
            <AmountField
              label={t("amount")}
              value={String(amount ?? "")}
              onChange={(v) => setValue("amount", v, { shouldValidate: true })}
              currency={payWallet}
              options={WALLETS}
              onCurrencyChange={(w) => setValue("payCode", w.code, { shouldValidate: true })}
              pickerHeading={t("selectWallet")}
              searchPlaceholder={t("search")}
              noResultsText={t("noCurrencies")}
              showBalance
              invalid={insufficientFunds || !!errors.amount}
            />

            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount.message}</p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={senderAmount <= 0 || !mobile.trim()}
              className="mt-2 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
            >
              {t("rechargeNow")}
              <Smartphone className="ms-2 size-4" />
            </Button>
          </form>
        )}

        {view === "overview" && (
          <div className="space-y-4">
            <p className="text-base font-bold">{t("overviewTitle")}</p>
            <div className="space-y-2">
              {overviewRows.map(({ label, value, highlight }) => (
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
                {t("rechargeNow")}
                <Smartphone className="ms-2 size-4" />
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
                  mobile: mobileLabel,
                })}
              </p>
            </div>
            <div className="w-full space-y-2 pt-2">
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
              {payWallet.symbol}{payWallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
          {LIMITS.map(({ key, value }) => (
            <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
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
    </div>
  );
}
