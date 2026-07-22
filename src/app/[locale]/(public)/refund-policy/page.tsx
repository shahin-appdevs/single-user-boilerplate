import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReceiptText } from "lucide-react";

import { isLocale } from "@/i18n/routing";

const SECTIONS = ["s1", "s2", "s3", "s4", "s5", "s6"];

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
  const t = await getTranslations({ locale, namespace: "refundPolicy" });
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

const EYEBROW =
  "inline-flex items-center gap-2 font-mono text-[12.5px] font-semibold tracking-[0.18em] text-primary uppercase";

export default async function RefundPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("refundPolicy");
  const tk = t as (key: string) => string;

  return (
    <section className="pt-[calc(var(--nav-h,72px)+clamp(48px,8vw,100px))] pb-[clamp(60px,9vw,120px)]">
      <div className="mx-auto w-full max-w-[860px] px-7">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className={EYEBROW}>
            <ReceiptText className="size-4" /> {t("eyebrow")}
          </span>
          <h1 className="font-heading text-[clamp(30px,4.4vw,52px)] leading-[1.06] font-extrabold tracking-tight text-balance">
            {t("title")}
          </h1>
        </div>

        <div className="glass mt-12 flex flex-col gap-8 rounded-3xl p-7 ring-1 ring-(--hairline) sm:p-10">
          {SECTIONS.map((s) => (
            <div key={s} className="flex flex-col gap-2">
              <h2 className="font-heading text-[clamp(18px,2.2vw,22px)] font-bold tracking-tight text-foreground">
                {tk(`${s}t`)}
              </h2>
              <p className="text-[15px] leading-relaxed text-muted-foreground">
                {tk(`${s}b`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
