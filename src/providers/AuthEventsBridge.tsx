"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { onAuthEvent } from "@/lib/api";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Wires Day 4's `auth-events` pub/sub to the auth store + query cache. Mounted
 * inside QueryProvider so `useQueryClient` resolves. Renders nothing.
 */
export function AuthEventsBridge() {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const off = onAuthEvent((evt) => {
      if (evt !== "unauthorized") return;
      useAuthStore.getState().logout("unauthorized");
      queryClient.clear();
      toast(t("auth.sessionExpired"));
      router.replace("/login");
    });
    return off;
  }, [queryClient, router, t]);

  return null;
}
