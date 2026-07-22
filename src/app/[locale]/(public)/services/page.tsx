import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Coins,
  CreditCard,
  Download,
  type LucideIcon,
  QrCode,
  ReceiptText,
  Send,
  Smartphone,
  Wallet,
} from "lucide-react";

import { isLocale } from "@/i18n/routing";

const SERVICES: { key: string; icon: LucideIcon }[] = [
  { key: "s1", icon: Send },
  { key: "s2", icon: Download },
  { key: "s3", icon: Coins },
  { key: "s4", icon: ReceiptText },
  { key: "s5", icon: Smartphone },
  { key: "s6", icon: QrCode },
  { key: "s7", icon: CreditCard },
  { key: "s8", icon: Wallet },
];

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
  const t = await getTranslations({ locale, namespace: "services" });
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

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("services");
  const tk = t as (key: string) => string;

  return (
    <section className="pt-[calc(var(--nav-h,72px)+clamp(48px,8vw,110px))] pb-[clamp(60px,9vw,120px)]">
      <div className="mx-auto w-full max-w-(--maxw) px-7">
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <span className={EYEBROW}>
            <QrCode className="size-4" /> {t("eyebrow")}
          </span>
          <h1 className="font-heading text-[clamp(30px,4.4vw,52px)] leading-[1.06] font-extrabold tracking-tight text-balance">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-[60ch] text-[clamp(15px,1.6vw,18px)] leading-relaxed text-muted-foreground">
            {t("sub")}
          </p>
        </div>

        {/* sticky-note service cards */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map(({ key, icon: Icon }, i) => (
            <div
              key={key}
              className={`group relative rounded-[20px] glass p-6 pt-9 shadow-card ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-0 dark:bg-(--surface-2) dark:ring-(--hairline) ${
                i % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]"
              }`}
            >
              {/* pin */}
              {/* <span
                aria-hidden
                className="absolute -top-2.5 left-1/2 size-5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff8a8a,#e0484a)] shadow-[0_6px_10px_-3px_rgba(200,40,40,.6)] ring-2 ring-white/60"
              /> */}

              <span className="font-heading block text-[32px] leading-none font-extrabold text-neutral-300 dark:text-white/15">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="mt-4 grid size-12 place-items-center rounded-xl bg-(image:--gradient) text-white shadow-md">
                <Icon className="size-6" />
              </span>

              <h3 className="font-heading mt-4 text-lg font-bold text-neutral-900 dark:text-foreground">
                {tk(`${key}t`)}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-600 dark:text-muted-foreground">
                {tk(`${key}d`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
