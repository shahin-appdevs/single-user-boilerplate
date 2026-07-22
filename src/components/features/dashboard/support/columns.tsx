"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ColumnMeta } from "@/components/shared/DataTable";
import type {
  SupportTicket,
  SupportTicketStatus,
} from "@/services/_shared/supportService";

type ColumnKey =
  | "table.ticketId"
  | "table.name"
  | "table.email"
  | "table.subject"
  | "table.status"
  | "table.lastReplied"
  | "table.details"
  | "view"
  | `status.${SupportTicketStatus}`;

type Translate = (key: ColumnKey) => string;

type Handlers = {
  onView: (ticket: SupportTicket) => void;
};

const STATUS_STYLES: Record<SupportTicketStatus, string> = {
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  open: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  answered: "bg-primary/15 text-primary",
  closed: "bg-muted text-muted-foreground",
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(new Date(iso));

export function createSupportColumns(
  t: Translate,
  { onView }: Handlers,
): ColumnDef<SupportTicket, unknown>[] {
  return [
    {
      accessorKey: "id",
      header: t("table.ticketId"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs font-semibold tabular-nums md:text-sm">
          #{row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: t("table.name"),
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs font-medium text-primary md:text-sm">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: t("table.email"),
      enableSorting: false,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs text-primary md:text-sm">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "subject",
      header: t("table.subject"),
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs text-primary md:text-sm">
          {row.original.subject}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: t("table.status"),
      enableSorting: true,
      cell: ({ row }) => (
        <Badge
          className={cn(
            "border-0 capitalize",
            STATUS_STYLES[row.original.status],
          )}
        >
          {t(`status.${row.original.status}`)}
        </Badge>
      ),
    },
    {
      accessorKey: "lastRepliedAt",
      header: t("table.lastReplied"),
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr" className="text-xs tabular-nums text-muted-foreground md:text-sm">
          {formatDate(row.original.lastRepliedAt)}
        </span>
      ),
    },
    {
      id: "details",
      header: t("table.details"),
      enableSorting: false,
      meta: { align: "end" } satisfies ColumnMeta,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button
            type="button"
            aria-label={t("view")}
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
            className="flex size-9 items-center justify-center rounded-md text-primary transition-colors hover:bg-primary/10"
          >
            <MessageSquare className="size-4" />
          </button>
        </div>
      ),
    },
  ];
}
