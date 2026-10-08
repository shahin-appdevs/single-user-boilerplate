import type { Metadata } from "next";
import {
  DM_Sans,
  Noto_Sans_Arabic,
  Playfair_Display,
} from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthBootstrapper } from "@/providers/AuthBootstrapper";
import { RoleThemeProvider } from "@/providers/RoleThemeProvider";
import { IdleTimerProvider } from "@/providers/IdleTimerProvider";
import { ScrollToTop } from "@/providers/ScrollToTop";
import { Toaster } from "@/components/shared/Toaster";
import { isLocale, isRtl, locales } from "@/i18n/routing";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});



export const metadata: Metadata = {
  title: "QRSim",
  description: "Smart crypto investment platform for everyone.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = isRtl(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${dmSans.variable} ${notoArabic.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <QueryProvider>
              <AuthBootstrapper />
              <RoleThemeProvider />
              <ScrollToTop />
              <IdleTimerProvider>{children}</IdleTimerProvider>
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
