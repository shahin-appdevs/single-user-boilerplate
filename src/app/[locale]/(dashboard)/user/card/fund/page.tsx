import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import FundCardPage from "@/components/features/dashboard/virtualCard/FundCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "vcard.fund" });
  return { title: t("metaTitle") };
}

const Page = () => {
  return (
    <div>
      <FundCardPage />
    </div>
  );
};

export default Page;
