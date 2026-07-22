"use client";

import { useTranslations } from "next-intl";

import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { WithdrawForm } from "./WithdrawForm";

export default function WithdrawMoneyPage() {
  const t = useTranslations("addWithdraw");

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 dapp:p-6">
      <DashboardPageHeader title={t("tabWithdraw")} subtitle={t("withdrawPageSubtitle")} />
      <WithdrawForm />
    </div>
  );
}
