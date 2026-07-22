"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw, SlidersHorizontal, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { AutomaticTopUpForm } from "./AutomaticTopUpForm";
import { ManualTopUpForm } from "./ManualTopUpForm";

type Tab = "automatic" | "manual";

export default function MobileTopUpPage() {
  const t = useTranslations("topUp");
  const [tab, setTab] = useState<Tab>("manual");

  const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: "automatic", label: t("tabAutomatic"), icon: RefreshCw          },
    { key: "manual",    label: t("tabManual"),    icon: SlidersHorizontal  },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />

      {/* Tab switcher — shared; each tab owns its form/preview/limits. */}
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

      {tab === "automatic" ? <AutomaticTopUpForm /> : <ManualTopUpForm />}
    </div>
  );
}
