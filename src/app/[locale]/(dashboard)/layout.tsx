import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { isLocale } from "@/i18n/routing";
import { AuthGuard } from "@/providers/AuthGuard";
import { RoleRouter } from "@/providers/RoleRouter";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    // <AuthGuard>
      <RoleRouter>{children}</RoleRouter>
    // </AuthGuard>
  );
}
