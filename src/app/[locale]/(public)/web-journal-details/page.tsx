import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import { JournalArticle } from "@/components/features/public/journal/JournalArticle";
import { JournalSidebar } from "@/components/features/public/journal/JournalSidebar";

const OG_IMG =
  "/images/logo/logo-dark.webp";

const KEYWORDS = [
  "agent",
  "contactless payment",
  "developer api",
  "digital wallet",
  "ewallet",
  "flutter app",
  "gateway solutions",
  "merchant api",
  "mobile wallet",
  "money transfer",
  "payment gateway",
  "qr code money transfer",
  "qr code payment",
  "qr code wallet",
  "QRPay Pro",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "webJournalDetails" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: KEYWORDS,
    openGraph: {
      title: t("ogTitle"),
      description: t("metaDescription"),
      images: [{ url: OG_IMG, width: 140, height: 80 }],
    },
  };
}

export default async function WebJournalDetailsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("webJournalDetails");

  return (
    <section className="pt-[calc(var(--nav-h,72px)+clamp(48px,8vw,100px))] pb-[clamp(60px,9vw,120px)]">
      <div className="mx-auto grid w-full max-w-(--maxw) grid-cols-1 items-start gap-8 px-7 lg:grid-cols-[1.7fr_1fr]">
        <Suspense fallback={null}>
          <JournalArticle backLabel={t("backToJournal")} />
        </Suspense>
        <JournalSidebar />
      </div>
    </section>
  );
}
