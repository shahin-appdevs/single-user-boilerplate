import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import AddMoneyPage from "@/components/features/dashboard/addWithdraw/AddMoneyPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "addWithdraw" });
  return { title: t("addMetaTitle") };
}

const Page = () => {
  return (
    <div>
      <AddMoneyPage />
    </div>
  );
};

export default Page;
