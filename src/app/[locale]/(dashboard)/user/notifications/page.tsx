"use client";

import { useTranslations } from "next-intl";

import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";

export default function NotificationsPage() {
  const t = useTranslations("dashboard");
  return (
    <div className="space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("nav.notifications")} subtitle={t("comingSoon")} />
      <div className="glass grid min-h-48 place-items-center rounded-2xl text-sm text-muted-foreground">
        {t("comingSoon")}
      </div>
    </div>
  );
}
