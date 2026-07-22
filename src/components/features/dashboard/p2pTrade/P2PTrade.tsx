"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Plus, Store, Tag, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { DataTable } from "@/components/shared/DataTable";
import { createTradeColumns } from "./columns";
import { CreateTradeForm } from "./CreateTradeForm";
import { SEED_MARKETPLACE, SEED_OFFERS, type Trade } from "./types";

type Tab = "marketplace" | "getOffer" | "createTrade";

const TAB_DATA: Record<"marketplace" | "getOffer", Trade[]> = {
  marketplace: SEED_MARKETPLACE,
  getOffer: SEED_OFFERS,
};

export default function P2PTradePage() {
  const t = useTranslations("p2pTrade");
  const [tab, setTab] = useState<Tab>("marketplace");

  const columns = useMemo(
    () => createTradeColumns(t, () => toast.message(t("viewSoon"))),
    [t],
  );

  const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: "marketplace", label: t("tabMarketplace"), icon: Store },
    { key: "getOffer",    label: t("tabGetOffer"),    icon: Tag   },
    { key: "createTrade", label: t("tabCreateTrade"), icon: Plus  },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xl font-bold md:text-2xl">{t("title")}</p>
      </div>

      {/* Tab switcher — same pattern as Mobile TopUp / Pay & Out. */}
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-1 rounded-xl bg-muted p-1">
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

      {tab === "createTrade" ? (
        <CreateTradeForm />
      ) : (
        <div className="glass rounded-2xl p-5">
          <DataTable
            columns={columns}
            data={TAB_DATA[tab]}
            title={t(`heading.${tab}`)}
            emptyText={t("empty")}
          />
        </div>
      )}
    </div>
  );
}
