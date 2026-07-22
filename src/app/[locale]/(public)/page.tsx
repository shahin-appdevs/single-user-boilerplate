import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { isLocale, locales } from "@/i18n/routing";
import { Hero } from "@/components/features/public/home/Hero";
import { ScrollMascot } from "@/components/features/public/home/ScrollMascot";
import { Services } from "@/components/features/public/home/Services";
import { About } from "@/components/features/public/home/About";
import { StepsHowItWorks } from "@/components/features/public/home/StepsHowItWorks";
import { TrustedBy } from "@/components/features/public/home/TrustedBy";
import { TrustMarquee } from "@/components/features/public/home/TrustMarquee";
import { TrustedInvestors } from "@/components/features/public/home/TrustedInvestors";
import { Testimonials } from "@/components/features/public/home/Testimonials";
import { Pricing } from "@/components/features/public/home/Pricing";
import { CtaPanel } from "@/components/features/public/home/CtaPanel";
import { Newsletter } from "@/components/features/public/home/Newsletter";

const OG_IMG =
  "/images/logo/logo-dark.webp";



const KEYWORDS = [
  "contactless payment",
  "developer api",
  "digital wallet",
  "ewallet",
  "flutter app",
  "gateway solutions",
  "mobile wallet",
  "money transfer",
  "payment gateway",
  "qr code money transfer",
  "qr code payment",
  "qr code wallet",
  "QRPay Pro",
];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: KEYWORDS,
    openGraph: {
      title: t("ogTitle"),
      description: t("description"),
      images: [{ url: OG_IMG, width: 140, height: 80 }],
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <ScrollMascot />
      <Hero />
      <Services />
      <About />
      <StepsHowItWorks />
      <TrustedBy />
      {/* <TrustMarquee /> */}
      <TrustedInvestors />
      <Testimonials />
      <Pricing />
      <CtaPanel />
      <Newsletter />
    </>
  );
}
