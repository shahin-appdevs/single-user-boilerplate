import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import { AuthShell } from "@/components/features/auth/AuthShell";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return <AuthShell>{children}</AuthShell>;
}
