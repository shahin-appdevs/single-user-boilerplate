"use client";

import { useEffect } from "react";

import { applyRoleTheme } from "@/lib/role-theme";
import { useAuthStore } from "@/store/authStore";

/** Applies the active user's role accent to `:root` whenever the role changes. */
export function RoleThemeProvider() {
  const role = useAuthStore((s) => s.role);

  useEffect(() => {
    applyRoleTheme(role);
  }, [role]);

  return null;
}
