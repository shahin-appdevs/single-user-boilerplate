"use client";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import type { ColumnMeta } from "@/components/shared/DataTable";
import type { GiftCard, GiftCardStatus } from "./types";

type ColumnKey =
  | "table.trxId"
  | "table.cardName"
  | "table.receiverEmail"
  | "table.payableAmount"
  | "table.status"
  | `status.${GiftCardStatus}`;

type Translate = (key: ColumnKey) => string;

const STATUS_STYLES: Record<GiftCardStatus, string> = {
  success: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  failed:  "bg-destructive/10 text-destructive",
};

export function createGiftCardColumns(t: Translate): ColumnDef<GiftCard, unknown>[] {
  return [
    {
      accessorKey: "id",
      header: t("table.trxId"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs font-semibold tabular-nums md:text-sm">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "name",
      header: t("table.cardName"),
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs font-medium md:text-sm">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "receiverEmail",
      header: t("table.receiverEmail"),
      enableSorting: false,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs text-muted-foreground md:text-sm">{row.original.receiverEmail}</span>
      ),
    },
    {
      accessorKey: "payableAmount",
      header: t("table.payableAmount"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs font-medium tabular-nums md:text-sm">
          {row.original.payableAmount.toFixed(4)} {row.original.currency}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      enableSorting: true,
      meta: { align: "end" } satisfies ColumnMeta,
      cell: ({ row }) => (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold", STATUS_STYLES[row.original.status])}>
          {t(`status.${row.original.status}`)}
        </span>
      ),
    },
  ];
}
