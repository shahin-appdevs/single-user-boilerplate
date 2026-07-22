"use client";

import { useTranslations } from "next-intl";

import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { AddMoneyForm } from "./AddMoneyForm";

export default function AddMoneyPage() {
  const t = useTranslations("addWithdraw");

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("tabAdd")} subtitle={t("addPageSubtitle")} />
      <AddMoneyForm />
    </div>
  );
}
