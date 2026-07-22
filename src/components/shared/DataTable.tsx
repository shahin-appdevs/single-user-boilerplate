"use client";

import { ReactNode, useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ColumnMeta {
  align?: "start" | "center" | "end";
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Shown top-left above the table */
  title?: ReactNode;
  /** Shown top-right above the table (buttons, filters, etc.) */
  extra?: ReactNode;
  /** Called with the original row data when a row is clicked */
  onRowClick?: (row: TData) => void;
  pageSize?: number;
  isLoading?: boolean;
  className?: string;
  /** Text shown when there are no rows. */
  emptyText?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  extra,
  onRowClick,
  pageSize = 10,
  isLoading = false,
  className,
  emptyText = "No results.",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    initialState: { pagination: { pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const SKELETON_ROWS = Math.min(pageSize, 5);

  return (
    <div className={cn("space-y-3", className)}>

      {/* Title + extra bar */}
      {(title || extra) && (
        <div className="flex items-center justify-between">
          {title && (
            <p className="text-sm font-semibold">{title}</p>
          )}
          {extra && (
            <div className="ms-auto flex items-center gap-2">{extra}</div>
          )}
        </div>
      )}

      <Table className="border-separate border-spacing-0">
        <TableHeader className="[&_tr]:border-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-muted/60 hover:bg-muted/60 [&>th:first-child]:rounded-s-md [&>th:last-child]:rounded-e-md"
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as ColumnMeta | undefined;
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <TableHead
                    key={header.id}
                    className={cn(meta?.align === "end" && "text-end")}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                          meta?.align === "end" && "ms-auto flex-row-reverse",
                          canSort
                            ? "cursor-pointer select-none hover:text-foreground"
                            : "cursor-default",
                        )}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          sorted === "asc"  ? <ChevronUp      className="size-3 shrink-0 text-foreground" /> :
                          sorted === "desc" ? <ChevronDown    className="size-3 shrink-0 text-foreground" /> :
                                             <ChevronsUpDown className="size-3 shrink-0 opacity-40"      />
                        )}
                      </button>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(
                  "hover:bg-muted/40",
                  onRowClick && "cursor-pointer",
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(meta?.align === "end" && "text-end")}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!isLoading && table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} &middot;{" "}
            {table.getFilteredRowModel().rows.length} rows
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-7"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
