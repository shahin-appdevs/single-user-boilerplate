import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import { PageHero } from "@/components/features/public/shared/PageHero";
import { ContactSection } from "@/components/features/public/contact/ContactSection";
import { Newsletter } from "@/components/features/public/home/Newsletter";

const OG_IMG = "/images/logo/logo-dark.webp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("ogTitle"),
      description: t("metaDescription"),
      images: [{ url: OG_IMG, width: 140, height: 80 }],
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s <span className="text-primary italic">talk</span>.
          </>
        }
        subtitle="Questions about strategies, custody, or onboarding a fund? Send a note — a human on the desk will respond, not a bot."
      />
      <ContactSection />
      <Newsletter />
    </>
  );
}
