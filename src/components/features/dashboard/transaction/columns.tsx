"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  SendHorizontal,
  ArrowLeftRight,
  Plus,
  QrCode,
  ReceiptText,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { ColumnMeta } from "@/components/shared/DataTable";

export type Activity = {
  id: string;
  type: string;
  name: string;
  sub: string;
  date: string;
  status: string;
  amount: number;
};

function TxIcon({ type }: { type: string }) {
  const Icon =
    type === "qr"       ? QrCode         :
    type === "send"     ? SendHorizontal :
    type === "topup"    ? Plus           :
    type === "exchange" ? ArrowLeftRight :
    ReceiptText;
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="size-3.5 text-primary" />
    </span>
  );
}

export const activityColumns: ColumnDef<Activity, unknown>[] = [
  {
    accessorKey: "name",
    header: "Transaction",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <TxIcon type={row.original.type} />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold md:text-sm">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.sub}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.original.date}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => (
      <span
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          row.original.status === "Completed" ? "text-emerald-500" : "text-amber-500",
        )}
      >
        <span className="size-1.5 rounded-full bg-current" />
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
    meta: { align: "end" } satisfies ColumnMeta,
    cell: ({ row }) => (
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          row.original.amount > 0 ? "text-emerald-500" : "",
        )}
      >
        {row.original.amount > 0 ? "+" : ""}
        {row.original.amount.toFixed(2)} USD
      </span>
    ),
  },
];
