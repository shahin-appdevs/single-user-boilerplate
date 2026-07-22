"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VCard } from "./types";

function Row({
  label,
  value,
  accent,
  bold,
  children,
}: {
  label: string;
  value?: string;
  accent?: boolean;
  bold?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children ?? (
        <span dir="ltr" className={cn("text-end text-sm tabular-nums", accent && "text-primary", bold && "font-bold")}>
          {value}
        </span>
      )}
    </div>
  );
}

export function CardDetailsModal({
  card,
  open,
  onOpenChange,
}: {
  card: VCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("vcard");
  const [revealed, setRevealed] = useState(false);
  const [blocked, setBlocked] = useState(card?.blocked ?? false);

  if (!card) return null;

  const pan = revealed
    ? `${card.bin}00 0000 0000 ${card.last4}`
    : `${card.bin}00******${card.last4}`;
  const cvv = revealed ? card.cvv : "***";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{t("detailsTitle")}</DialogTitle>
        </DialogHeader>

        {/* Balance hero */}
        <div className="mx-6 mt-2 rounded-xl bg-primary/5 px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">{t("totalBalance")}</p>
          <p className="text-sm font-semibold text-amber-500">{t("testMode")}</p>
        </div>

        {/* Details */}
        <div className="mx-4 mb-6 mt-3 rounded-xl bg-muted/40 px-4">
          <Row label={t("details.account")} value={card.account} accent />
          <Row label={t("details.holder")}  value={card.holder} />
          <Row label={t("details.currency")} value={card.currency} />
          <Row label={t("details.brand")}   value={card.brand} />
          <Row label={t("details.type")}    value={t("details.virtual")} />
          <Row label={t("details.pan")}     value={pan} bold />
          <Row label={t("details.expiry")}  value={card.exp} />
          <Row label={t("details.cvv")}     value={cvv} />

          <Row label={t("details.status")}>
            <div className="flex items-center gap-1 rounded-lg bg-background p-1">
              <button
                type="button"
                onClick={() => setBlocked(false)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                  !blocked ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {t("details.unblock")}
              </button>
              <button
                type="button"
                onClick={() => setBlocked(true)}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-semibold transition-colors",
                  blocked ? "bg-destructive text-white" : "text-muted-foreground",
                )}
              >
                {t("details.block")}
              </button>
            </div>
          </Row>

          <Row label={t("details.reveal")}>
            <button
              type="button"
              onClick={() => setRevealed((r) => !r)}
              aria-label={t("details.reveal")}
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </Row>
        </div>
      </DialogContent>
    </Dialog>
  );
}
