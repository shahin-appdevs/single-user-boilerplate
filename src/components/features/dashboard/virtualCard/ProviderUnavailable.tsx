"use client";

import { useTranslations } from "next-intl";
import { CreditCard } from "lucide-react";

import { CARD_PROVIDER } from "./provider";

/** Fallback for providers not yet implemented (e.g. strow). */
export function ProviderUnavailable() {
  const t = useTranslations("vcard");
  return (
    <div className="mx-auto max-w-6xl p-4 dapp:p-6">
      <div className="glass grid min-h-64 place-items-center rounded-2xl p-8 text-center">
        <div className="space-y-2">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <CreditCard className="size-5 text-primary" />
          </span>
          <p className="text-sm font-semibold">{t("providerUnavailable", { provider: CARD_PROVIDER })}</p>
        </div>
      </div>
    </div>
  );
}
