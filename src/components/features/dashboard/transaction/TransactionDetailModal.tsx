"use client";

import {
  SendHorizontal,
  ArrowLeftRight,
  Plus,
  QrCode,
  ReceiptText,
  Download,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Activity } from "./columns";

function TxIconLg({ type }: { type: string }) {
  const Icon =
    type === "qr"       ? QrCode         :
    type === "send"     ? SendHorizontal :
    type === "topup"    ? Plus           :
    type === "exchange" ? ArrowLeftRight :
    ReceiptText;
  return (
    <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
      <Icon className="size-7 text-primary" />
    </span>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 ">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm", bold ? "font-bold" : "font-medium")}>{value}</span>
    </div>
  );
}

interface TransactionDetailModalProps {
  tx: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailModal({
  tx,
  open,
  onOpenChange,
}: TransactionDetailModalProps) {
  if (!tx) return null;

  const isCredit = tx.amount > 0;
  const amountStr = `${isCredit ? "+ " : "- "}${Math.abs(tx.amount).toFixed(4)} USD`;
  const txRef = `MT${tx.id.padStart(8, "6925167")}`;
  const typeLabel = tx.type.charAt(0).toUpperCase() + tx.type.slice(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm p-0 overflow-hidden">

        {/* Visually hidden title for a11y */}
        <DialogHeader className="sr-only">
          <DialogTitle>{tx.name} — {amountStr}</DialogTitle>
        </DialogHeader>

        {/* Hero */}
        <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-5 text-center">
          <TxIconLg type={tx.type} />
          <p className="mt-1 text-base font-bold">{tx.name}</p>
          <p className={cn("text-2xl font-bold tracking-tight", isCredit ? "text-emerald-500" : "")}>
            {amountStr}
          </p>
          <span
            className={cn(
              "text-xs font-semibold",
              tx.status === "Completed" ? "text-emerald-500" : "text-amber-500",
            )}
          >
            {tx.status.toLowerCase()}
          </span>
        </div>

        {/* Details */}
        <div className="mx-4 mb-4 rounded-xl bg-muted/40 px-4">
          <Row label="TRX"           value={txRef}       />
          <Row label="Date"          value={tx.date}     />
          <Row label="Type"          value={typeLabel}   bold />
          <Row label="Description"   value={tx.sub}      />
          <Row label="Total Payable" value={`${Math.abs(tx.amount).toFixed(4)} USD`} bold />
        </div>

        {/* Download */}
        <div className="px-4 pb-6">
          <Button className="w-full gap-2 font-semibold" size="lg">
            <Download className="size-4" />
            Download Receipt
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
