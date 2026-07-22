"use client";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import type { CardTxn, CardTxnStatus } from "./types";

type ColumnKey =
  | "table.type"
  | "table.amount"
  | "table.payable"
  | "table.status"
  | `status.${CardTxnStatus}`;

type Translate = (key: ColumnKey) => string;

const STATUS_STYLES: Record<CardTxnStatus, string> = {
  success: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  failed:  "bg-destructive/10 text-destructive",
};

export function createCardTxnColumns(t: Translate): ColumnDef<CardTxn, unknown>[] {
  return [
    {
      accessorKey: "type",
      header: t("table.type"),
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs font-semibold md:text-sm">{row.original.type}</span>
      ),
    },
    {
      accessorKey: "amount",
      header: t("table.amount"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs tabular-nums md:text-sm">
          {row.original.amount.toFixed(4)} {row.original.currency}
        </span>
      ),
    },
    {
      accessorKey: "payable",
      header: t("table.payable"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs tabular-nums md:text-sm">
          {row.original.payable.toFixed(4)} {row.original.currency}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      enableSorting: true,
      cell: ({ row }) => (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", STATUS_STYLES[row.original.status])}>
          {t(`status.${row.original.status}`)}
        </span>
      ),
    },
  ];
}
