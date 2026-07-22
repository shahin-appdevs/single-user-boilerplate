"use client";

import { useTranslations } from "next-intl";
import { Gift } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GiftCard } from "./types";

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span dir="ltr" className={cn("text-end text-sm tabular-nums", bold ? "font-bold" : "font-medium")}>{value}</span>
    </div>
  );
}

export function GiftCardDetailModal({
  card,
  open,
  onOpenChange,
}: {
  card: GiftCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("gift");
  if (!card) return null;

  const cur = card.currency;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-md max-h-[90dvh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{card.name} — {card.id}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-4 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Gift className="size-7 text-primary" />
          </span>
          <p className="mt-1 text-base font-bold">{card.name}</p>
        </div>

        <div className="mx-4 mb-6 rounded-xl bg-muted/40 px-4">
          <Row label={t("detail.trxId")}         value={card.id} />
          <Row label={t("detail.cardName")}      value={card.name} />
          <Row label={t("detail.receiverEmail")} value={card.receiverEmail} />
          <Row label={t("detail.receiverPhone")} value={card.receiverPhone} />
          <Row label={t("detail.unitPrice")}     value={`${card.unitPrice.toFixed(4)} ${cur}`} />
          <Row label={t("detail.quantity")}      value={String(card.quantity)} />
          <Row label={t("detail.totalPrice")}    value={`${card.totalPrice.toFixed(4)} ${cur}`} />
          <Row label={t("detail.exchangeRate")}  value={card.exchangeRate} />
          <Row label={t("detail.payableUnit")}   value={`${card.payableUnit.toFixed(4)} ${cur}`} />
          <Row label={t("detail.totalCharge")}   value={`${card.totalCharge.toFixed(4)} ${cur}`} />
          <Row label={t("detail.payableAmount")} value={`${card.payableAmount.toFixed(4)} ${cur}`} bold />
        </div>
      </DialogContent>
    </Dialog>
  );
}
