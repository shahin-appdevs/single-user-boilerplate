import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { BgField } from "@/components/shared/BgField";
import { SmoothScroll } from "@/components/shared/SmoothScroll";

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <SmoothScroll />
      <BgField />
      <Header />
      {/* ScrollSmoother transforms #smooth-content, which would break
          position:fixed/sticky descendants — the fixed chrome above stays
          outside it; only the scrolling body (main + footer) goes inside. */}
      <div id="smooth-wrapper" className="flex flex-1 flex-col">
        <div id="smooth-content" className="flex flex-1 flex-col">
          <main className="relative z-[1] flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </>
  );
}
