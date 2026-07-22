import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import AddRecipientPage from "@/components/features/dashboard/recipients/AddRecipient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "recipients" });
  return { title: t("addTitle") };
}

const Page = () => {
  return (
    <div>
      <AddRecipientPage />
    </div>
  );
};

export default Page;
