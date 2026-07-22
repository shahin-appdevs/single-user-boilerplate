import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import WithdrawMoneyPage from "@/components/features/dashboard/addWithdraw/WithdrawMoneyPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "addWithdraw" });
  return { title: t("withdrawMetaTitle") };
}

const Page = () => {
  return (
    <div>
      <WithdrawMoneyPage />
    </div>
  );
};

export default Page;
