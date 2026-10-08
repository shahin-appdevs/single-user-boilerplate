import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import CreateCustomerPage from "@/components/features/dashboard/virtualCard/CreateCustomer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "vcard.customer" });
  return { title: t("metaTitle") };
}

const Page = () => {
  return (
    <div>
      <CreateCustomerPage />
    </div>
  );
};

export default Page;
