import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import CreatePaymentLinkPage from "@/components/features/dashboard/paymentLink/CreatePaymentLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "payLink" });
  return { title: t("createHeading") };
}

const Page = () => {
  return (
    <div>
      <CreatePaymentLinkPage />
    </div>
  );
};

export default Page;
