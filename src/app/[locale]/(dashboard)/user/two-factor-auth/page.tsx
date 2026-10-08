import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import TwoFactorAuthPage from "@/components/features/dashboard/twoFactor/TwoFactorAuth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "twoFa" });
  return { title: t("metaTitle") };
}

const Page = () => {
  return (
    <div>
      <TwoFactorAuthPage />
    </div>
  );
};

export default Page;
