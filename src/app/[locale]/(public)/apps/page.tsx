import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Check,
  type LucideIcon,
  Smartphone,
} from "lucide-react";

import { isLocale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const CARDS: { key: string; icon: LucideIcon; feats: string[] }[] = [
  { key: "user", icon: Smartphone, feats: ["f1", "f2", "f3"] },
];

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "apps" });
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

export default async function AppsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("apps");
  const tk = t as (key: string) => string;

  return (
    <>
      {/* hero */}
      <section className="pt-[calc(var(--nav-h,72px)+clamp(48px,8vw,110px))] pb-[clamp(30px,5vw,60px)] text-center ">
        <div className="mx-auto flex w-full max-w-(--maxw) flex-col items-center gap-5 px-7">
          <span className={EYEBROW}>{t("eyebrow")}</span>
          <h1 className="font-heading max-w-[20ch] text-[clamp(32px,5vw,60px)] leading-[1.05] font-extrabold tracking-tight text-balance">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-[60ch] text-[clamp(16px,1.7vw,20px)] text-muted-foreground">
            {t("sub")}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3.5">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full border-0 bg-(image:--gradient) px-6 text-white hover:opacity-90"
            >
              <Link href="/register">
                {t("ctaPrimary")}
                <ArrowRight className="rtl:-scale-x-100" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
              <Link href="/contact">{t("ctaSecondary")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* role cards */}
      <section className="pb-[clamp(60px,9vw,120px)]">
        <div className="mx-auto grid w-full max-w-(--maxw) grid-cols-1 gap-6 px-7 md:grid-cols-3">
          {CARDS.map(({ key, icon: Icon, feats }, i) => (
            <div
              key={key}
              className={`glass flex flex-col gap-4 rounded-3xl p-7 ring-1 ${
                i === 0 ? "ring-primary/40" : "ring-(--hairline)"
              }`}
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-(image:--gradient) text-white">
                <Icon className="size-6" />
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {tk(`${key}T`)}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-muted-foreground">
                {tk(`${key}D`)}
              </p>
              <div className="mt-1 flex flex-col gap-2.5">
                {feats.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-2.5 text-[14px] text-foreground"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                      <Check className="size-3.5" />
                    </span>
                    {tk(`${key}${f}`)}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
