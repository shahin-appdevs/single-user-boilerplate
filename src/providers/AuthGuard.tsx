"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-side route guard for the `(app)` segment. Middleware can't gate auth:
 * the token lives in localStorage, unreachable on the edge. Never renders
 * children before `status === 'authenticated'` (no private-layout flash).
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuthStore((s) => s.status);
  const setIntendedPath = useAuthStore((s) => s.setIntendedPath);

  useEffect(() => {
    if (status === "unauthenticated") {
      setIntendedPath(pathname);
      router.replace("/login");
    }
  }, [status, pathname, router, setIntendedPath]);

  if (status === "authenticated") {
    return <>{children}</>;
  }

  if (status === "unknown") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
        <Skeleton className="size-10 rounded-full" />
        <span className="text-sm text-muted-foreground">
          {t("auth.loading")}
        </span>
      </div>
    );
  }

  // unauthenticated → redirect effect is running.
  return null;
}
