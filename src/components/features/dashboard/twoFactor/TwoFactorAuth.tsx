"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Copy, Download, QrCode, ShieldCheck } from "lucide-react";

import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import Image from "next/image";

const SECRET_KEY = "NJ1& JKHUI LD21 NF42";
const GA_LOGO = '/images/icons/google_authenticator.webp';
const GA_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2";

function Step({ n, title, children }: { n: number; title: string; children?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-sm">
        <span className="me-2 font-semibold text-primary">{n}.</span>
        {title}
      </p>
      {children && <div className="ps-6">{children}</div>}
    </div>
  );
}

export default function TwoFactorAuthPage() {
  const t = useTranslations("twoFa");

  const [enabled, setEnabled] = useState(false);
  const [confirmEnable, setConfirmEnable] = useState(false);
  const [confirmDisable, setConfirmDisable] = useState(false);

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(SECRET_KEY);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed"));
    }
  }

  function enable() {
    // TODO: replace with the enable-2FA API mutation (verifies `code`).
    setEnabled(true);
    setConfirmEnable(false);
    toast.success(t("enabled"));
  }

  function disable() {
    // TODO: replace with the disable-2FA API mutation.
    setEnabled(false);
    setConfirmDisable(false);
    toast.success(t("disabled"));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={enabled ? t("titleOn") : t("title")} subtitle={t("subtitle")} />

      <div className="glass rounded-2xl p-5 md:p-6">
        {enabled ? (
          /* Enabled state */
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck className="size-8 text-emerald-500" />
            </span>
            <div className="space-y-1">
              <p className="text-lg font-bold">{t("enabledTitle")}</p>
              <p className="max-w-sm text-sm text-muted-foreground">{t("enabledDesc")}</p>
            </div>
            <Button size="lg" variant="destructive" className="mt-2 h-11" onClick={() => setConfirmDisable(true)}>
              {t("disable")}
            </Button>
          </div>
        ) : (
          /* Setup state */
          <div className="space-y-6">
            {/* Step 1 — app + QR */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <Step n={1} title={t("step1")}>
                  <div className="flex w-44 flex-col items-center gap-3 rounded-xl border border-hairline bg-muted/40 p-4 text-center">
                   
                    <Image src={GA_LOGO} alt="" height={200} width={200}  className="size-14 shrink-0 rounded-xl" />
                    <span className="text-sm font-semibold leading-tight">{t("googleAuth")}</span>
                    <a
                      href={GA_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg [background:var(--gradient)] text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      <Download className="size-3.5" />
                      {t("download")}
                    </a>
                  </div>
                </Step>
              </div>

              <div className="mx-auto flex size-48 shrink-0 items-center justify-center rounded-xl border border-hairline bg-background sm:mx-0">
                <QrCode className="size-40 text-foreground" />
              </div>
            </div>

            {/* Step 2 — secret key */}
            <Step n={2} title={t("step2")}>
              <p className="mb-2 text-xs text-muted-foreground">{t("step2Hint")}</p>
              <div className="flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3">
                <span dir="ltr" className="min-w-0 flex-1 truncate text-sm font-semibold tracking-wide">{SECRET_KEY}</span>
                <button
                  type="button"
                  onClick={copyKey}
                  aria-label={t("copy")}
                  className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </Step>

            {/* Step 3 — login note */}
            <Step n={3} title={t("step4")} />

            <div className="flex justify-end pt-2">
              <Button
                size="lg"
                onClick={() => setConfirmEnable(true)}
                className="h-11 [background:var(--gradient)] text-white hover:opacity-90"
              >
                {t("enable")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmEnable}
        onOpenChange={setConfirmEnable}
        title={t("enableConfirmTitle")}
        description={t("enableConfirmDesc")}
        confirmLabel={t("enable")}
        cancelLabel={t("cancel")}
        onConfirm={enable}
      />

      <ConfirmDialog
        open={confirmDisable}
        onOpenChange={setConfirmDisable}
        title={t("disableConfirmTitle")}
        description={t("disableConfirmDesc")}
        confirmLabel={t("disable")}
        cancelLabel={t("cancel")}
        onConfirm={disable}
        destructive
      />
    </div>
  );
}
