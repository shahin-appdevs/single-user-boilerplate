"use client";

import { useTranslations } from "next-intl";
import { CreditCard } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CardTxn } from "./types";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit", month: "2-digit", year: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  }).format(new Date(iso));

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span dir="ltr" className={cn("text-end text-sm tabular-nums", bold ? "font-bold" : "font-medium")}>{value}</span>
    </div>
  );
}

export function CardTxnDetailModal({
  txn,
  open,
  onOpenChange,
}: {
  txn: CardTxn | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("vcard");
  if (!txn) return null;

  const cur = txn.currency;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md max-h-[90dvh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{txn.type} — {txn.trxId}</DialogTitle>
        </DialogHeader>

        {/* Hero */}
        <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CreditCard className="size-7 text-primary" />
          </span>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-emerald-600">
            {t("detail.virtualCard")}
          </p>
        </div>

        {/* Details */}
        <div className="mx-4 mb-6 rounded-xl bg-muted/40 px-4">
          <Row label={t("detail.type")}        value={t("detail.virtualCard")} />
          <Row label={t("detail.trxId")}       value={txn.trxId} />
          <Row label={t("detail.exchangeRate")} value={txn.exchangeRate} />
          <Row label={t("detail.fees")}        value={`${txn.fees.toFixed(4)} ${cur}`} />
          <Row label={t("detail.cardAmount")}  value={`${txn.amount.toFixed(2)} ${cur}`} bold />
          <Row label={t("detail.cardMasked")}  value={txn.cardMasked} bold />
          <Row label={t("detail.balance")}     value={`${txn.balance.toFixed(4)} ${cur}`} bold />
          <Row label={t("detail.date")}        value={formatDate(txn.createdAt)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
