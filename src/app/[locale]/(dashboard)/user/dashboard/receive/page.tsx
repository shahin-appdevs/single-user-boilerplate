import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import ReceiveMoneyPage from "@/components/features/dashboard/receive/ReceiveMoney";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "receive" });
  return { title: t("metaTitle") };
}

const Page = () => {
  return (
    <div>
      <ReceiveMoneyPage />
    </div>
  );
};

export default Page;
