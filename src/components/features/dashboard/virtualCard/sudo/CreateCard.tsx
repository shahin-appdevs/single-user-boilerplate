"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, CreditCard, Info, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
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
import { usePinConfirm } from "@/hooks/user/usePinConfirm";
import { AmountField, FieldLabel, WALLETS } from "../../payOut/shared";

type View = "form" | "overview" | "success";

const BRANDS = [
  { value: "visa",       label: "Visa"       },
  { value: "mastercard", label: "Mastercard" },
] as const;

const FIXED_CHARGE   = 1.0;
const PERCENT_CHARGE = 1.0;

const MIN_USD = 5;
const MAX_USD = 10000;
const DAILY_REMAINING_USD = 790;

const LIMITS = [
  { key: "transactionLimit", value: "5.0000 USD - 10,000.0000 USD" },
  { key: "dailyLimit",       value: "1,000.0000 USD"               },
  { key: "remainingDaily",   value: "790.0000 USD"                 },
  { key: "monthlyLimit",     value: "10,000.0000 USD"              },
  { key: "remainingMonthly", value: "9,790.0000 USD"               },
] as const;

const schema = z.object({
  amount: z.coerce.number().positive(),
  cardCode: z.string().min(1),
  brand: z.string().min(1),
  fromCode: z.string().min(1),
});
type CreateCardFormValues = z.input<typeof schema>;

export default function CreateCardPage() {
  const t = useTranslations("vcard.create");
  const tv = useTranslations("vcard.create.validation");
  const router = useRouter();

  const [view, setView] = useState<View>("form");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateCardFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { amount: "", cardCode: WALLETS[0].code, brand: "", fromCode: WALLETS[0].code },
  });

  const amount = watch("amount");
  const cardCode = watch("cardCode");
  const brand = watch("brand");
  const fromCode = watch("fromCode");

  const cardCurrency = WALLETS.find((w) => w.code === cardCode) ?? WALLETS[0];
  const fromWallet = WALLETS.find((w) => w.code === fromCode) ?? WALLETS[0];

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const cardAmount = parseFloat(String(amount)) || 0;
  const totalCharge = FIXED_CHARGE + (cardAmount * PERCENT_CHARGE) / 100;
  const totalPayable = cardAmount + totalCharge;
  const insufficientFunds = totalPayable > 0 && totalPayable > fromWallet.balance;
  const rateLabel = `1 ${cardCurrency.code} = 1.0000 ${fromWallet.code}`;
  const brandLabel = BRANDS.find((b) => b.value === brand)?.label ?? "—";

  const onSubmit = handleSubmit((values) => {
    if (!values.brand) {
      setError("brand", { message: tv("brand") });
      toast.error(tv("brand"));
      return;
    }
    const amt = Number(values.amount) || 0;
    if (amt < MIN_USD) {
      setError("amount", { message: tv("min", { amount: MIN_USD.toFixed(4) }) });
      toast.error(tv("min", { amount: MIN_USD.toFixed(4) }));
      return;
    }
    if (amt > MAX_USD) {
      setError("amount", { message: tv("max", { amount: MAX_USD.toLocaleString("en-US") }) });
      toast.error(tv("max", { amount: MAX_USD.toLocaleString("en-US") }));
      return;
    }
    if (amt > DAILY_REMAINING_USD) {
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
    resetForm({ amount: "", cardCode: WALLETS[0].code, brand: "", fromCode: WALLETS[0].code });
    setView("form");
  }

  const overviewRows = [
    { label: t("rows.cardAmount"),   value: `${cardAmount.toFixed(4)} ${cardCurrency.code}` },
    { label: t("rows.brand"),        value: brandLabel },
    { label: t("rows.totalCharge"),  value: `${FIXED_CHARGE.toFixed(4)} ${fromWallet.code} + ${PERCENT_CHARGE.toFixed(4)}% = ${totalCharge.toFixed(4)} ${fromWallet.code}` },
    { label: t("rows.totalPayable"), value: `${totalPayable.toFixed(4)} ${fromWallet.code}`, highlight: true },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="size-9 shrink-0" aria-label={t("back")} onClick={() => router.push("/user/dashboard/card")}>
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Button>
        <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: form / overview / success */}
        <div className="glass h-full rounded-2xl p-5">
          {view === "form" && (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CreditCard className="size-4 text-primary" />
                </span>
                <p className="text-sm font-semibold">{t("formTitle")}</p>
              </div>

              <input type="hidden" {...register("cardCode")} />
              <input type="hidden" {...register("brand")} />
              <input type="hidden" {...register("fromCode")} />

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground" dir="ltr">{rateLabel}</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <AmountField
                label={t("amount")}
                value={String(amount ?? "")}
                onChange={(v) => setValue("amount", v, { shouldValidate: true })}
                currency={cardCurrency}
                options={WALLETS}
                onCurrencyChange={(w) => setValue("cardCode", w.code, { shouldValidate: true })}
                pickerHeading={t("selectCurrency")}
                searchPlaceholder={t("search")}
                noResultsText={t("noCurrencies")}
                invalid={insufficientFunds || !!errors.amount}
              />

              <div className="space-y-2">
                <FieldLabel>{t("cardBrand")}</FieldLabel>
                <Select value={brand} onValueChange={(v) => setValue("brand", v, { shouldValidate: true })}>
                  <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                    <SelectValue placeholder={t("chooseOne")} />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANDS.map((b) => (
                      <SelectItem key={b.value} value={b.value} className="ps-3 py-2.5">{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <FieldLabel>{t("fromWallet")}</FieldLabel>
                <Select value={fromCode} onValueChange={(v) => setValue("fromCode", v, { shouldValidate: true })}>
                  <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WALLETS.map((w) => (
                      <SelectItem key={w.code} value={w.code} className="ps-3 py-2.5">
                        {w.name} ({w.balance.toFixed(2)} {w.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(errors.amount || errors.brand) && (
                <p className="text-xs text-destructive">{errors.amount?.message ?? errors.brand?.message}</p>
              )}

              <p className="px-1 text-xs text-muted-foreground" dir="ltr">
                {t("fees")}: {FIXED_CHARGE.toFixed(4)} {fromWallet.code} + {PERCENT_CHARGE.toFixed(4)}% = {totalCharge.toFixed(4)} {fromWallet.code}
              </p>

              <Button
                type="submit"
                size="lg"
                disabled={cardAmount <= 0 || !brand}
                className="mt-2 h-12 w-full [background:var(--gradient)] text-white hover:opacity-90 disabled:opacity-50"
              >
                {t("buyCard")}
                <CreditCard className="ms-2 size-4" />
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
                <Button size="lg" className="h-11 flex-1 [background:var(--gradient)] text-white hover:opacity-90" onClick={pinConfirm.open}>
                  {t("buyCard")}
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
                  {t("successDetail", { brand: brandLabel })}
                </p>
              </div>
              <div className="w-full space-y-2 pt-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
                  <span className="text-xs text-muted-foreground md:text-sm">{t("rows.totalPayable")}</span>
                  <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                    {totalPayable.toFixed(4)} {fromWallet.code}
                  </span>
                </div>
              </div>
              <Button size="lg" className="mt-2 h-11 w-full [background:var(--gradient)] text-white hover:opacity-90" onClick={reset}>
                {t("newCard")}
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
              <span className="flex items-center gap-2 text-xs font-medium text-foreground md:text-sm">
                <Wallet className="size-3.5 text-primary" />
                {t("availableBalance")}
              </span>
              <span className="text-xs font-semibold tabular-nums text-primary md:text-sm">
                {fromWallet.symbol}{fromWallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
