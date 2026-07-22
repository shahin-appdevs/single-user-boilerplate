"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpFromLine, Store, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { MakePaymentForm } from "./MakePaymentForm";
import { MoneyOutForm } from "./MoneyOutForm";

type Tab = "payment" | "moneyOut";

export default function PayOutPage() {
  const tp = useTranslations("payout");
  const [tab, setTab] = useState<Tab>("payment");

  const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: "payment",  label: tp("tabPayment"),  icon: Store           },
    { key: "moneyOut", label: tp("tabMoneyOut"), icon: ArrowUpFromLine },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={tp("title")} subtitle={tp("subtitle")} />

      {/* Tab switcher — the only shared concern; each tab owns its form/logic. */}
      <div className="mx-auto grid max-w-md grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={cn(
              "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-xs md:text-sm font-semibold transition-all",
              tab === key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "payment" ? <MakePaymentForm /> : <MoneyOutForm />}
    </div>
  );
}
