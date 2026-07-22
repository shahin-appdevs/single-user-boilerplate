"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ReferralUser = {
  id: string;
  userName: string;
  email: string;
  phone: string;
  referCode: string;
};

type ReferralColumnKey =
  | "table.userName"
  | "table.email"
  | "table.phone"
  | "table.referCode";

type Translate = (key: ReferralColumnKey) => string;

export function createReferralColumns(t: Translate): ColumnDef<ReferralUser, unknown>[] {
  return [
    {
      accessorKey: "userName",
      header: t("table.userName"),
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs font-semibold md:text-sm">{row.original.userName}</span>
      ),
    },
    {
      accessorKey: "email",
      header: t("table.email"),
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground md:text-sm">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "phone",
      header: t("table.phone"),
      enableSorting: false,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs text-muted-foreground tabular-nums md:text-sm">
          {row.original.phone}
        </span>
      ),
    },
    {
      accessorKey: "referCode",
      header: t("table.referCode"),
      enableSorting: false,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium md:text-sm">{row.original.referCode}</span>
      ),
    },
  ];
}
