"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MoreHorizontal, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DataTable } from "@/components/shared/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createStatementColumns } from "./columns";
import { SEED_TXNS, TXN_CATEGORIES, type TxnCategory } from "./types";

type Filter = "all" | TxnCategory;

/** Tabs visible inline before collapsing into the "more" menu. */
function useVisibleCount() {
  const [count, setCount] = useState(3);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setCount(mq.matches ? 5 : 3);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return count;
}

export default function StatementPage() {
  const t = useTranslations("statement");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const visibleCount = useVisibleCount();

  const columns = useMemo(() => createStatementColumns(t), [t]);

  const data = useMemo(
    () =>
      SEED_TXNS.filter((x) => filter === "all" || x.category === filter).filter((x) => {
        const q = search.toLowerCase();
        return !q || x.activity.toLowerCase().includes(q) || x.person.toLowerCase().includes(q);
      }),
    [filter, search],
  );

  const TABS: { key: Filter; label: string }[] = [
    { key: "all", label: t("tabs.all") },
    ...TXN_CATEGORIES.map((c) => ({ key: c as Filter, label: t(`cat.${c}`) })),
  ];

  const inline = TABS.slice(0, visibleCount);
  const overflow = TABS.slice(visibleCount);
  const activeInOverflow = overflow.some((tab) => tab.key === filter);

  function tabClass(active: boolean) {
    return cn(
      "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all md:text-sm",
      active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
    );
  }

  return (
    <div className="mx-auto space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="glass space-y-4 rounded-2xl p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
            {inline.map(({ key, label }) => (
              <button key={key} type="button" onClick={() => setFilter(key)} aria-pressed={filter === key} className={tabClass(filter === key)}>
                {label}
              </button>
            ))}

            {overflow.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn(tabClass(activeInOverflow), "outline-none")} aria-label={t("more")}>
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="max-h-72 w-52 overflow-y-auto">
                  {overflow.map(({ key, label }) => (
                    <DropdownMenuItem
                      key={key}
                      onSelect={() => setFilter(key)}
                      className={cn("text-sm focus:[background:var(--gradient)] focus:text-white", filter === key && "bg-primary/5 font-semibold text-primary")}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex h-9 items-center gap-2 rounded-lg bg-muted/40 px-3 lg:w-64 focus-within:ring-3 focus-within:ring-ring/50">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <DataTable columns={columns} data={data} emptyText={t("empty")} />
      </div>
    </div>
  );
}
