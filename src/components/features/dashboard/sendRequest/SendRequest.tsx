"use client";

import { useTranslations } from "next-intl";

import { SendMoneyForm } from "./SendMoneyForm";

export default function SendRequestPage() {
  const t = useTranslations("sendRequest");

  return (
    <div className="relative min-h-full overflow-hidden p-4 dapp:p-6">
      {/* Ambient background — radial glows + faint grid, matching the design. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(1200px_800px_at_15%_-10%,hsl(var(--primary)/0.12),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(1200px_800px_at_50%_30%,black,transparent_80%)]"
      />

      <div className="mx-auto max-w-6xl">
        {/* Top bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
          <div>
           
            <h1 className="font-hero text-[clamp(30px,4vw,44px)] leading-[1.05] font-bold tracking-tight text-foreground">
              {t("title")}
            </h1>
          </div>

          <div className="text-end">
            <div className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
              {t("available")}
            </div>
            <div className="text-xl md:text-3xl font-hero font-bold text-foreground">
              $24,819<span className="text-primary">.42</span>
            </div>
          </div>
        </div>

        <SendMoneyForm />
      </div>
    </div>
  );
}
