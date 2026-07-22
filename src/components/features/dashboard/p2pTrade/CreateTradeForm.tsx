"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2, Handshake, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { createTradeSchema, type TradeFormValues } from "@/lib/validators/p2pTrade";
import { Button } from "@/components/ui/button";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";
import { AmountField, CURRENCIES, FieldLabel, WALLETS } from "../payOut/shared";

type View = "form" | "overview" | "success";

const FIXED_CHARGE   = 0;
const PERCENT_CHARGE = 0;

/** Limits expressed in the selling currency (GBP defaults). */
const LIMITS = [
  { key: "transactionLimit", value: "0.7575 GBP - 757,518,000.0000 GBP" },
  { key: "dailyLimit",       value: "3,787.5900 GBP"                    },
  { key: "remainingDaily",   value: "3,687.5900 GBP"                    },
  { key: "monthlyLimit",     value: "37,875.9000 GBP"                   },
  { key: "remainingMonthly", value: "37,775.9000 GBP"                   },
] as const;

export function CreateTradeForm() {
  const t = useTranslations("p2pTrade.create");
  const tv = useTranslations("p2pTrade.create.validation");

  const [view, setView] = useState<View>("form");

  const schema = useMemo(() => createTradeSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { sellAmount: "", sellCode: "GBP", askRate: "", askCode: "USD" },
  });

  const sellAmount = watch("sellAmount");
  const sellCode = watch("sellCode");
  const askRate = watch("askRate");
  const askCode = watch("askCode");

  const sellWallet = WALLETS.find((w) => w.code === sellCode) ?? WALLETS[0];
  const askCurrency = CURRENCIES.find((c) => c.code === askCode) ?? CURRENCIES[0];

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const sell = parseFloat(String(sellAmount)) || 0;
  const rate = parseFloat(String(askRate)) || 0;
  const charge = FIXED_CHARGE + (sell * PERCENT_CHARGE) / 100;
  const buyerWillPay = sell * rate;
  const youWillPay = sell + charge;
  const insufficientFunds = youWillPay > 0 && youWillPay > sellWallet.balance;
  const rateLabel = `1 ${sellWallet.code} = ${rate.toFixed(4)} ${askCurrency.code}`;

  const onSubmit = handleSubmit((values) => {
    if (Number(values.sellAmount) + charge > sellWallet.balance) {
      setError("sellAmount", { message: tv("insufficient") });
      toast.error(tv("insufficient"));
      return;
    }
    setView("overview");
  });

  function reset() {
    resetForm({ sellAmount: "", sellCode: "GBP", askRate: "", askCode: "USD" });
    setView("form");
  }

  const overviewRows = [
    { label: t("rows.sellingAmount"), value: `${sell.toFixed(4)} ${sellWallet.code}` },
    { label: t("rows.fees"),          value: `${charge.toFixed(4)} ${sellWallet.code}` },
    { label: t("rows.buyerWillPay"),  value: `${buyerWillPay.toFixed(4)} ${askCurrency.code}` },
    { label: t("rows.youWillPay"),    value: `${youWillPay.toFixed(4)} ${sellWallet.code}`, highlight: true },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Left: form / overview / success */}
      <div className="glass rounded-2xl p-5">
        {view === "form" && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Handshake className="size-4 text-primary" />
              </span>
              <p className="text-sm font-semibold">{t("formTitle")}</p>
            </div>

            <input type="hidden" {...register("sellCode")} />
            <input type="hidden" {...register("askCode")} />

            {/* Selling exchange rate divider */}
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground" dir="ltr">{rateLabel}</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-4">
              {/* Selling amount */}
              <AmountField
                label={t("sellingAmount")}
                value={String(sellAmount ?? "")}
                onChange={(v) => setValue("sellAmount", v, { shouldValidate: true })}
                currency={sellWallet}
                options={WALLETS}
                onCurrencyChange={(w) => setValue("sellCode", w.code, { shouldValidate: true })}
                pickerHeading={t("selectWallet")}
                searchPlaceholder={t("search")}
                noResultsText={t("noCurrencies")}
                showBalance
                invalid={insufficientFunds || !!errors.sellAmount}
              />

              {/* Asking rate */}
              <AmountField
                label={t("askingRate")}
                value={String(askRate ?? "")}
                onChange={(v) => setValue("askRate", v, { shouldValidate: true })}
                currency={askCurrency}
                options={CURRENCIES}
                onCurrencyChange={(c) => setValue("askCode", c.code, { shouldValidate: true })}
                pickerHeading={t("selectCurrency")}
                searchPlaceholder={t("search")}
                noResultsText={t("noCurrencies")}
                invalid={!!errors.askRate}
              />
            </div>

            {(errors.sellAmount || errors.askRate) && (
              <p className="text-xs text-destructive">
                {errors.sellAmount?.message ?? errors.askRate?.message}
              </p>
            )}

           

            <Button
              type="submit"
              size="lg"
              disabled={sell <= 0 || rate <= 0}
              className="mt-2 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
            >
              {t("continue")}
              <ArrowRight className="ms-2 size-4 rtl:rotate-180" />
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
                {t("createTrade")}
                <Handshake className="ms-2 size-4" />
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
                  sell: `${sell.toFixed(4)} ${sellWallet.code}`,
                  buy: `${buyerWillPay.toFixed(4)} ${askCurrency.code}`,
                })}
              </p>
            </div>
            <Button
              size="lg"
              className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90"
              onClick={reset}
            >
              {t("newTrade")}
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
              {sellWallet.symbol}{sellWallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
