"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { roleHome } from "@/lib/dashboard/nav";
import { useAuthStore } from "@/store/authStore";
import type { Role } from "@/types/auth";

// Bases that do NOT belong to a given role. A user wandering into another
// role's section is bounced to their own home. Shared pages (/profile,
// /notifications) belong to no role, so they're never matched here.
const FOREIGN_BASES: Record<Role, string[]> = {
  user: [],
};

export function RoleRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    const foreign = FOREIGN_BASES[role].some(
      (base) => pathname === base || pathname.startsWith(`${base}/`),
    );
    if (foreign) router.replace(roleHome(role));
  }, [role, pathname, router]);

  return <>{children}</>;
}
