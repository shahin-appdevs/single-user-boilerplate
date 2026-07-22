import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CalendarClock } from "lucide-react";

import { isLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { MotionReveal } from "@/components/shared/MotionReveal";
import { PageHero } from "@/components/features/public/shared/PageHero";
import { JournalSidebar } from "@/components/features/public/journal/JournalSidebar";
import { POSTS as ALL_POSTS } from "@/components/features/public/journal/data";

const EXCERPT =
  "In this post, we explore the incredible impact of positive thinking on various aspects of life. Discover the science-bac…";

const detailHref = (id: number, slug: string) =>
  `/web-journal-details?id=${id}&slug=${slug}`;

const POSTS = [ALL_POSTS["2"], ALL_POSTS["3"]];

const OG_IMG = "/images/logo/logo-dark.webp";

const KEYWORDS = [
  "announcement",
  "crypto news",
  "product update",
  "release notes",
  "roadmap",
  "CrypInvest",
];

const CHIP =
  "inline-flex w-fit items-center rounded-full bg-primary/15 px-3 py-1 font-mono text-[10.5px] font-semibold tracking-[0.06em] text-primary uppercase";
const READMORE =
  "mt-auto inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary transition-all hover:gap-2.5";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "webJournal" });
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

export default async function AnnouncementPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("webJournal");
  const [featured, ...rest] = POSTS;

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} />

      <section className="pb-[clamp(60px,9vw,120px)]">
        <div className="mx-auto w-full max-w-[var(--maxw)] px-7">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.7fr_1fr]">
            {/* main column */}
            <div className="flex flex-col gap-8">
              {/* featured */}
              <MotionReveal>
                <article className="group relative overflow-hidden rounded-3xl border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 transition-colors duration-500 hover:border-primary/30">
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={featured.img}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 760px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#04120F] via-[#04120F]/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-8">
                      <span className={CHIP}>{featured.category}</span>
                      <h2 className="max-w-[26ch] font-hero text-[clamp(22px,2.6vw,34px)] leading-tight font-bold text-foreground">
                        {featured.title}
                      </h2>
                      <p className="max-w-[60ch] text-[14px] leading-relaxed text-muted-foreground">
                        {EXCERPT}
                      </p>
                      <div className="mt-1 flex items-center gap-4 text-[13px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarClock className="size-4" /> {featured.date}
                        </span>
                        <Link
                          href={detailHref(featured.id, featured.slug)}
                          className="inline-flex items-center gap-1.5 font-semibold text-primary transition-all hover:gap-2.5"
                        >
                          {t("readMore")}
                          <ArrowRight className="size-4 rtl:-scale-x-100" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </MotionReveal>

              {/* grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {rest.map((p, i) => (
                  <MotionReveal key={p.id} delay={i * 0.08}>
                    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary/12 bg-linear-160 from-primary/12 to-primary/2 transition-colors duration-500 hover:border-primary/30">
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={p.img}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 360px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className={`${CHIP} absolute top-3 start-3`}>
                          {p.category}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-2.5 p-6">
                        <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                          <CalendarClock className="size-3.5" /> {p.date}
                        </span>
                        <h3 className="font-hero text-[19px] leading-snug font-bold text-foreground">
                          {p.title}
                        </h3>
                        <p className="text-[13.5px] leading-relaxed text-muted-foreground">
                          {EXCERPT}
                        </p>
                        <Link href={detailHref(p.id, p.slug)} className={READMORE}>
                          {t("readMore")}
                          <ArrowRight className="size-4 rtl:-scale-x-100" />
                        </Link>
                      </div>
                    </article>
                  </MotionReveal>
                ))}
              </div>
            </div>

            {/* sidebar */}
            <JournalSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
