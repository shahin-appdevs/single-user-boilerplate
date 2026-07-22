"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2, Info, Smartphone } from "lucide-react";

import { cn } from "@/lib/utils";
import { createAutoTopUpSchema, type AutoTopUpFormValues } from "@/lib/validators/topUp";
import { findCountry } from "@/constants/countries";
import { Button } from "@/components/ui/button";
import { PinConfirmDialog } from "@/components/shared/PinConfirmDialog";
import { usePinConfirm } from "@/hooks/user/usePinConfirm";
import { FieldLabel } from "../payOut/shared";
import { PhoneInput } from "./PhoneInput";

type View = "form" | "overview" | "success";

/** Placeholder until the operator-lookup API fills these in. */
const DASH = "--";

const LIMIT_KEYS = [
  "transactionLimit",
  "dailyLimit",
  "remainingDaily",
  "monthlyLimit",
  "remainingMonthly",
] as const;

export function AutomaticTopUpForm() {
  const t = useTranslations("topUp");
  const tv = useTranslations("topUp.validation");

  const [view, setView] = useState<View>("form");

  const schema = useMemo(() => createAutoTopUpSchema(tv), [tv]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<AutoTopUpFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { country: "BD", mobile: "" },
  });

  const country = watch("country");
  const mobile = String(watch("mobile") ?? "");
  const dial = findCountry(country).dial;

  const pinConfirm = usePinConfirm(async (_pin) => {
    await new Promise((r) => setTimeout(r, 1200));
    setView("success");
  });

  const mobileLabel = mobile ? `${dial} ${mobile}` : DASH;

  const onSubmit = handleSubmit(() => setView("overview"));

  function reset() {
    resetForm({ country: "BD", mobile: "" });
    setView("form");
  }

  const overviewRows = [
    { label: t("rows.operatorName"), value: DASH },
    { label: t("rows.mobileNumber"), value: mobileLabel },
    { label: t("rows.amount"),       value: DASH },
    { label: t("rows.conversion"),   value: DASH },
    { label: t("rows.totalCharge"),  value: DASH },
    { label: t("rows.totalPayable"), value: DASH, highlight: true },
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

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">{t("exchangeRate")}: {DASH}</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-2">
              <FieldLabel>{t("mobileNumber")}</FieldLabel>
              <input type="hidden" {...register("mobile")} />
              <PhoneInput
                country={country}
                onCountryChange={(c) => setValue("country", c, { shouldValidate: true })}
                value={mobile}
                onChange={(v) => setValue("mobile", v, { shouldValidate: true })}
                placeholder={t("mobilePlaceholder")}
                invalid={!!errors.mobile}
              />
              {errors.mobile && (
                <p className="text-xs text-destructive">{errors.mobile.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={!mobile.trim()}
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
                {t("successDetail", { amount: DASH, mobile: mobileLabel })}
              </p>
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

      {/* Right: limitations (filled by the operator-lookup API) */}
      <div className="glass h-full rounded-2xl p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Info className="size-4 text-primary" />
          </span>
          <p className="text-sm font-semibold">{t("limitationsTitle")}</p>
        </div>

        <div className="space-y-2">
          {LIMIT_KEYS.map((key) => (
            <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="text-xs text-muted-foreground md:text-sm">{t(`limits.${key}`)}</span>
              <span className="text-xs font-medium tabular-nums md:text-sm">{DASH}</span>
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
