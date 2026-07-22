"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { COUNTRIES } from "@/constants/countries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ColumnMeta } from "@/components/shared/DataTable";
import type { Recipient } from "@/services/dashboard/recipientService";

type ColumnKey =
  | "table.name"
  | "table.country"
  | "table.zip"
  | "table.email"
  | "table.action"
  | "edit"
  | "delete";

type Translate = (key: ColumnKey) => string;

type Handlers = {
  onEdit: (r: Recipient) => void;
  onDelete: (r: Recipient) => void;
};

const countryName = (code: string) =>
  COUNTRIES.find((c) => c.code === code)?.name ?? code;

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function createRecipientColumns(
  t: Translate,
  { onEdit, onDelete }: Handlers,
): ColumnDef<Recipient, unknown>[] {
  return [
    {
      accessorKey: "name",
      header: t("table.name"),
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarImage src={row.original.avatarUrl} alt="" />
            <AvatarFallback className="bg-primary/10 text-[11px] font-bold text-primary">
              {initials(row.original.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold md:text-sm">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: t("table.country"),
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground md:text-sm">
          {countryName(row.original.country)}
        </span>
      ),
    },
    {
      accessorKey: "zipCode",
      header: t("table.zip"),
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs tabular-nums text-muted-foreground md:text-sm">
          {row.original.zipCode}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: t("table.email"),
      enableSorting: false,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs text-muted-foreground md:text-sm">
          {row.original.email}
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
