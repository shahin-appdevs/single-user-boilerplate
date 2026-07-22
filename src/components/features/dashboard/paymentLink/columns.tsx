"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ColumnMeta } from "@/components/shared/DataTable";
import type { PaymentLink, PaymentLinkType } from "./types";

type ColumnKey =
  | "table.title"
  | "table.type"
  | "table.amount"
  | "table.status"
  | "table.createdAt"
  | "table.action"
  | "statusActive"
  | "statusInactive"
  | "copy"
  | "edit"
  | "delete"
  | `types.${PaymentLinkType}`;

type Translate = (key: ColumnKey) => string;

type Handlers = {
  onCopy: (l: PaymentLink) => void;
  onEdit: (l: PaymentLink) => void;
  onDelete: (l: PaymentLink) => void;
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(iso));

export function createPaymentLinkColumns(
  t: Translate,
  { onCopy, onEdit, onDelete }: Handlers,
): ColumnDef<PaymentLink, unknown>[] {
  return [
    {
      accessorKey: "title",
      header: t("table.title"),
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs font-semibold md:text-sm">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "type",
      header: t("table.type"),
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground md:text-sm">
          {t(`types.${row.original.type}`)}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: t("table.amount"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs tabular-nums md:text-sm">
          {row.original.amount.toFixed(4)} ({row.original.qty}) {row.original.currency}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      enableSorting: true,
      cell: ({ row }) => {
        const active = row.original.status === "active";
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              active
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-muted text-muted-foreground",
            )}
          >
            {t(active ? "statusActive" : "statusInactive")}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("table.createdAt"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs text-muted-foreground md:text-sm">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "action",
      header: t("table.action"),
      enableSorting: false,
      meta: { align: "end" } satisfies ColumnMeta,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label={t("copy")}
            onClick={(e) => {
              e.stopPropagation();
              onCopy(row.original);
            }}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Copy className="size-4" />
          </button>
          <button
            type="button"
            aria-label={t("edit")}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(row.original);
            }}
            className="flex size-9 items-center justify-center rounded-md text-emerald-600 transition-colors hover:bg-emerald-500/10"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            aria-label={t("delete")}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(row.original);
            }}
            className="flex size-9 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];
}
