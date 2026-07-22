"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Check, Copy, Lock, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createReferralColumns, type ReferralUser } from "./columns";

/* ─── Data ───────────────────────────────────────────────────────────────── */

type Level = {
  level: number;
  requireRefers: number;
  deposit: string;
  perRefer: string;
};

const LEVELS: Level[] = [
  { level: 1, requireRefers: 0,   deposit: "0.00 USD",       perRefer: "1.00 USD"  },
  { level: 2, requireRefers: 5,   deposit: "100.00 USD",     perRefer: "2.00 USD"  },
  { level: 3, requireRefers: 10,  deposit: "500.00 USD",     perRefer: "3.00 USD"  },
  { level: 4, requireRefers: 30,  deposit: "1,000.00 USD",   perRefer: "5.00 USD"  },
  { level: 5, requireRefers: 50,  deposit: "5,000.00 USD",   perRefer: "10.00 USD" },
  { level: 6, requireRefers: 100, deposit: "10,000.00 USD",  perRefer: "50.00 USD" },
];

const SUMMARY = {
  name: "Daniel Khan",
  totalRefers: 0,
  totalDeposit: "120.00 USD",
  currentLevel: 1,
  referCode: "yizhz4R1",
};

const REFERRAL_USERS: ReferralUser[] = [];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ReferralStatusPage() {
  const t = useTranslations("referral");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const columns = useMemo(() => createReferralColumns(t), [t]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return REFERRAL_USERS;
    return REFERRAL_USERS.filter(
      (u) =>
        u.userName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q) ||
        u.referCode.toLowerCase().includes(q),
    );
  }, [search]);

  function copyCode() {
    navigator.clipboard?.writeText(SUMMARY.referCode);
    setCopied(true);
    toast.success(t("copied"));
    setTimeout(() => setCopied(false), 1500);
  }

  const initials = SUMMARY.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
        {/* Left: user summary */}
        <div className="glass flex flex-col items-center gap-4 rounded-2xl p-5 text-center">
          <Avatar className="size-20 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-lg font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>

          <p className="text-base font-bold">{SUMMARY.name}</p>

          <div className="w-full space-y-2 pt-2">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="text-xs text-muted-foreground md:text-sm">{t("totalRefers")}</span>
              <span className="text-xs font-semibold tabular-nums md:text-sm">{SUMMARY.totalRefers}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="text-xs text-muted-foreground md:text-sm">{t("totalDeposit")}</span>
              <span className="text-xs font-semibold tabular-nums md:text-sm">{SUMMARY.totalDeposit}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <span className="text-xs text-muted-foreground md:text-sm">{t("currentPosition")}</span>
              <span className="text-xs font-semibold text-primary md:text-sm">
                {t("level", { n: SUMMARY.currentLevel })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-primary/5 px-3 py-2.5">
              <span className="shrink-0 text-xs text-muted-foreground md:text-sm">{t("referCode")}</span>
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate font-mono text-xs font-bold md:text-sm">{SUMMARY.referCode}</span>
                <button
                  type="button"
                  onClick={copyCode}
                  aria-label={t("copy")}
                  className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: account level tiers */}
        <div className="glass rounded-2xl p-5">
          <p className="mb-4 text-sm font-semibold">{t("accountLevel")}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {LEVELS.map((lv) => {
              const isCurrent = lv.level === SUMMARY.currentLevel;
              const locked = lv.level > SUMMARY.currentLevel;
              return (
                <div
                  key={lv.level}
                  className={cn(
                    "rounded-xl border p-4 transition-colors",
                    isCurrent
                      ? "border-dashed border-primary bg-primary/5"
                      : "border-border bg-muted/30",
                    locked && "opacity-60",
                  )}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
                        isCurrent ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {t("level", { n: lv.level })}
                    </span>
                    {isCurrent ? (
                      <span className="text-[11px] font-semibold text-primary">{t("current")}</span>
                    ) : locked ? (
                      <Lock className="size-3.5 text-muted-foreground" />
                    ) : null}
                  </div>

                  {/* Requirement */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("requirement")}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t("requireRefers")}</span>
                      <span className="font-semibold tabular-nums">{lv.requireRefers}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t("deposit")}</span>
                      <span className="font-semibold tabular-nums">{lv.deposit}</span>
                    </div>
                  </div>

                  {/* Commission */}
                  <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("commission")}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t("perRefer")}</span>
                      <span className="font-semibold tabular-nums text-primary">{lv.perRefer}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Referral users table */}
      <div className="glass rounded-2xl p-5">
        <DataTable
          columns={columns}
          data={filtered}
          title={t("referralUsers")}
          emptyText={t("noData")}
          extra={
            <div className="flex h-9 items-center gap-2 rounded-lg bg-muted/40 px-3">
              <Users className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 min-w-0 bg-transparent text-xs outline-none placeholder:text-muted-foreground sm:w-48"
              />
            </div>
          }
        />
      </div>
    </div>
  );
}
