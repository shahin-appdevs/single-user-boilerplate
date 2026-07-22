import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import CreateCardPage from "@/components/features/dashboard/virtualCard/CreateCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "vcard.create" });
  return { title: t("metaTitle") };
}

const Page = () => {
  return (
    <div>
      <CreateCardPage />
    </div>
  );
};

export default Page;
