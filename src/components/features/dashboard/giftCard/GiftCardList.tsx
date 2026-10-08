"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";
import { COUNTRIES } from "@/constants/countries";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BRAND_STYLE, CATALOG_CARDS, type CatalogCard } from "./catalog";
import { BuyGiftCardModal } from "./BuyGiftCardModal";

const PAGE_SIZE = 12;

function CatalogTile({ card, getLabel, onGet }: { card: CatalogCard; getLabel: string; onGet: () => void }) {
  const style = BRAND_STYLE[card.brand];
  return (
    <div className={cn("relative flex aspect-3/4 flex-col overflow-hidden rounded-xl", style.bg)}>
      {/* Hanger notch */}
      <span className="absolute inset-s-1/2 top-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/25 rtl:translate-x-1/2" />
      <div className="flex flex-1 items-center justify-center p-4">
        <span className={cn("text-2xl font-extrabold tracking-tight", style.logoClass)}>{style.logo}</span>
      </div>
      <div className="space-y-2 bg-linear-to-t from-black/85 via-black/55 to-transparent p-3 pt-8">
        <p className="text-sm font-semibold text-white">{card.name}</p>
        <Button
          size="sm"
          onClick={onGet}
          className="h-9 w-full [background:var(--gradient)] text-xs text-white hover:opacity-90"
        >
          {getLabel}
        </Button>
      </div>
    </div>
  );
}

export default function GiftCardListPage() {
  const t = useTranslations("gift.catalog");
  const router = useRouter();

  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [buying, setBuying] = useState<CatalogCard | null>(null);

  const filtered = useMemo(
    () => CATALOG_CARDS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="size-9 shrink-0" aria-label={t("back")} onClick={() => router.push("/user/gift-card")}>
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Button>
        <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={country} onValueChange={(v) => { setCountry(v); setPage(1); }}>
          <SelectTrigger className="h-11! w-full border-0 bg-muted/40 px-3 text-xs sm:max-w-xs md:text-sm">
            <SelectValue placeholder={t("selectCountry")} />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {COUNTRIES.map((c) => (
              <SelectItem key={c.code} value={c.code} className="ps-3 py-2.5">{c.flag} {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex h-11 flex-1 items-center gap-2 rounded-lg bg-muted/40 px-3 focus-within:ring-3 focus-within:ring-ring/50">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={t("searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="glass grid min-h-40 place-items-center rounded-2xl text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {visible.map((c) => (
            <CatalogTile key={c.id} card={c} getLabel={t("get")} onGet={() => setBuying(c)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            aria-label={t("prev")}
            className="flex size-9 items-center justify-center rounded-full ring-1 ring-border transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                p === current ? "bg-foreground text-background" : "ring-1 ring-border hover:bg-muted",
              )}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={current === pageCount}
            aria-label={t("next")}
            className="flex size-9 items-center justify-center rounded-full ring-1 ring-border transition-colors hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight className="size-4 rtl:rotate-180" />
          </button>
        </div>
      )}

      <BuyGiftCardModal
        card={buying}
        open={!!buying}
        onOpenChange={(o) => { if (!o) setBuying(null); }}
      />
    </div>
  );
}
