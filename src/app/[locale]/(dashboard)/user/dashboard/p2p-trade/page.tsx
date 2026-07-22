import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import P2PTradePage from "@/components/features/dashboard/p2pTrade/P2PTrade";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "p2pTrade" });
  return { title: t("metaTitle") };
}

const Page = () => {
  return (
    <div>
      <P2PTradePage />
    </div>
  );
};

export default Page;
