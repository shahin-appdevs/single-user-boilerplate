"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ColumnMeta } from "@/components/shared/DataTable";
import type { Trade, TradeStatus } from "./types";

type ColumnKey =
  | "table.trxId"
  | "table.selling"
  | "table.asking"
  | "table.rate"
  | "table.status"
  | "table.date"
  | "table.action"
  | "view"
  | `status.${TradeStatus}`;

type Translate = (key: ColumnKey) => string;

const STATUS_STYLES: Record<TradeStatus, string> = {
  pending:   "bg-amber-500/10 text-amber-600",
  active:    "bg-blue-500/10 text-blue-600",
  completed: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-muted text-muted-foreground",
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  }).format(new Date(iso));

export function createTradeColumns(
  t: Translate,
  onView: (trade: Trade) => void,
): ColumnDef<Trade, unknown>[] {
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
      accessorKey: "sellAmount",
      header: t("table.selling"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs tabular-nums md:text-sm">
          {row.original.sellAmount.toFixed(4)} {row.original.sellCurrency}
        </span>
      ),
    },
    {
      accessorKey: "askAmount",
      header: t("table.asking"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs tabular-nums md:text-sm">
          {row.original.askAmount.toFixed(4)} {row.original.askCurrency}
        </span>
      ),
    },
    {
      accessorKey: "rate",
      header: t("table.rate"),
      enableSorting: false,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs text-muted-foreground md:text-sm">{row.original.rate}</span>
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
    {
      accessorKey: "createdAt",
      header: t("table.date"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs text-muted-foreground md:text-sm">{formatDate(row.original.createdAt)}</span>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      enableSorting: false,
      meta: { align: "end" } satisfies ColumnMeta,
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <button
            type="button"
            aria-label={t("view")}
            onClick={(e) => { e.stopPropagation(); onView(row.original); }}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Eye className="size-4" />
          </button>
        </div>
      ),
    },
  ];
}
