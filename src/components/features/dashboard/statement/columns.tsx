"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownLeft, ArrowUpRight, Check, RefreshCw, X, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/dashboard/initials";
import type { StatementTxn, TxnStatus, TxnType } from "./types";

type ColumnKey =
  | "table.type"
  | "table.amount"
  | "table.method"
  | "table.status"
  | "table.activity"
  | "table.people"
  | "table.date"
  | `type.${TxnType}`
  | `status.${TxnStatus}`;

type Translate = (key: ColumnKey) => string;

const TYPE_META: Record<TxnType, { icon: LucideIcon; color: string }> = {
  sent:      { icon: ArrowUpRight,  color: "text-rose-500" },
  received:  { icon: ArrowDownLeft, color: "text-emerald-500" },
  converted: { icon: RefreshCw,     color: "text-blue-500" },
};

const STATUS_META: Record<TxnStatus, { icon: LucideIcon; cls: string }> = {
  success:    { icon: Check, cls: "text-emerald-600" },
  incomplete: { icon: RefreshCw, cls: "text-muted-foreground" },
  failed:     { icon: X, cls: "text-destructive" },
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(iso));

export function createStatementColumns(t: Translate): ColumnDef<StatementTxn, unknown>[] {
  return [
    {
      accessorKey: "type",
      header: t("table.type"),
      enableSorting: true,
      cell: ({ row }) => {
        const m = TYPE_META[row.original.type];
        return (
          <span className="flex items-center gap-2 text-xs font-medium md:text-sm">
            <m.icon className={cn("size-4", m.color)} />
            {t(`type.${row.original.type}`)}
          </span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: t("table.amount"),
      enableSorting: true,
      cell: ({ row }) => (
        <div dir="ltr">
          <p className="text-xs font-semibold tabular-nums md:text-sm">{row.original.amount}</p>
          {row.original.secondary && (
            <p className="text-[11px] text-muted-foreground">{row.original.secondary}</p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "method",
      header: t("table.method"),
      enableSorting: false,
      cell: ({ row }) => (
        <div>
          <p className="text-xs font-medium md:text-sm">{row.original.method}</p>
          <p dir="ltr" className="text-[11px] text-muted-foreground">{row.original.methodDetail}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      enableSorting: true,
      cell: ({ row }) => {
        const m = STATUS_META[row.original.status];
        return (
          <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold", m.cls)}>
            <m.icon className="size-3" />
            {t(`status.${row.original.status}`)}
          </span>
        );
      },
    },
    {
      accessorKey: "activity",
      header: t("table.activity"),
      enableSorting: false,
      cell: ({ row }) => {
        const { activity, activityName } = row.original;
        if (!activityName) return <span className="text-xs text-muted-foreground md:text-sm">{activity}</span>;
        const [before, after] = activity.split(activityName);
        return (
          <span className="text-xs text-muted-foreground md:text-sm">
            {before}<span className="font-semibold text-foreground">{activityName}</span>{after}
          </span>
        );
      },
    },
    {
      accessorKey: "person",
      header: t("table.people"),
      enableSorting: false,
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
              {getInitials(row.original.person)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium md:text-sm">{row.original.person}</span>
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: t("table.date"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs text-muted-foreground md:text-sm">{formatDate(row.original.date)}</span>
      ),
    },
  ];
}
