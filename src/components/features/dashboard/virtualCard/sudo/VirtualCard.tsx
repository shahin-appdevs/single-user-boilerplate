"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Info,
  Plus,
  Receipt,
  Star,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DataTable } from "@/components/shared/DataTable";
import { VirtualCardView } from "./VirtualCardView";
import { CardDetailsModal } from "./CardDetailsModal";
import { CardTxnDetailModal } from "./CardTxnDetailModal";
import { createCardTxnColumns } from "./columns";
import { SEED_CARDS, SEED_CARD_TXNS, type CardTxn } from "./types";

export default function VirtualCardPage() {
  const t = useTranslations("vcard");
  const router = useRouter();

  const [activeId, setActiveId] = useState(SEED_CARDS[0].id);
  const active = SEED_CARDS.find((c) => c.id === activeId) ?? SEED_CARDS[0];

  const [selectedTxn, setSelectedTxn] = useState<CardTxn | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [defaultOpen, setDefaultOpen] = useState(false);

  const columns = useMemo(() => createCardTxnColumns(t), [t]);

  const ACTIONS: { key: string; icon: LucideIcon }[] = [
    { key: "details",     icon: Info   },
    { key: "makeDefault", icon: Star   },
    { key: "fund",        icon: Wallet },
    { key: "transaction", icon: Receipt },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        {/* Left: active card + actions + balance + other cards */}
        <div className="glass space-y-5 rounded-2xl p-5">
          <VirtualCardView card={active} />

          {/* Actions */}
          <div className="grid grid-cols-4 gap-2">
            {ACTIONS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  key === "details"
                    ? setDetailsOpen(true)
                    : key === "makeDefault"
                      ? setDefaultOpen(true)
                      : key === "fund"
                        ? router.push("/user/dashboard/card/fund")
                        : toast.message(t(`actionSoon.${key}` as "actionSoon.details"))
                }
                className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl bg-muted/50 py-3 text-xs font-medium transition-colors hover:bg-muted"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                {t(`actions.${key}` as "actions.details")}
              </button>
            ))}
          </div>

          {/* Total balance */}
          <div className="rounded-xl bg-primary/5 px-4 py-3">
            <p className="text-xs text-muted-foreground">{t("totalBalance")}</p>
            <p dir="ltr" className="text-2xl font-bold tabular-nums">
              {active.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
              <span className="text-sm font-medium text-muted-foreground">{active.currency}</span>
            </p>
          </div>

          {/* Other cards */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("otherCards")}</p>
            <div className="scroll-thin flex gap-3 overflow-x-auto p-1.5">
              {SEED_CARDS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "rounded-xl ring-2 transition-all",
                    c.id === activeId ? "ring-primary" : "ring-transparent hover:ring-border",
                  )}
                >
                  <VirtualCardView card={c} compact />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: create actions + transaction history */}
        <div className="space-y-4">
          <div className="glass grid grid-cols-1 gap-3 rounded-2xl p-5 sm:grid-cols-2">
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/user/dashboard/card/customer")}
              className="h-11"
            >
              <UserPlus className="me-2 size-4" />
              {t("createCustomer")}
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/user/dashboard/card/create")}
              className="h-11 [background:var(--gradient)] text-white hover:opacity-90"
            >
              <Plus className="me-2 size-4" />
              {t("createCard")}
            </Button>
          </div>

          <div className="glass rounded-2xl p-5">
            <DataTable
              columns={columns}
              data={SEED_CARD_TXNS}
              title={t("transactionHistory")}
              emptyText={t("empty")}
              onRowClick={setSelectedTxn}
            />
          </div>
        </div>
      </div>

      <CardTxnDetailModal
        txn={selectedTxn}
        open={!!selectedTxn}
        onOpenChange={(o) => { if (!o) setSelectedTxn(null); }}
      />

      <CardDetailsModal
        card={active}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <ConfirmDialog
        open={defaultOpen}
        onOpenChange={setDefaultOpen}
        title={t("makeDefaultTitle")}
        description={t("makeDefaultDesc", { card: `•••• ${active.last4}` })}
        confirmLabel={t("actions.makeDefault")}
        cancelLabel={t("cancel")}
        onConfirm={() => { toast.success(t("madeDefault")); setDefaultOpen(false); }}
      />
    </div>
  );
}
