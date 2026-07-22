"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { profileService } from "@/services/_shared/profileService";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/store/authStore";

/** One-shot bootstrap on mount, then hydrate `user` via the `me` query. */
export function AuthBootstrapper() {
  const queryClient = useQueryClient();
  const status = useAuthStore((s) => s.status);
  const hasUser = useAuthStore((s) => s.user !== null);

  useEffect(() => {
    useAuthStore.getState().bootstrap();
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || hasUser) return;
    let active = true;
    void queryClient
      .fetchQuery({ queryKey: queryKeys.shared.profile(), queryFn: profileService.getMe })
      .then((user) => {
        // 401s are handled by the axios interceptor; other errors leave
        // `user` null and surface on the next gated action.
        if (active) useAuthStore.getState().setUser(user);
      })
      .catch(() => {
        /* interceptor / guard handles auth failures */
      });
    return () => {
      active = false;
    };
  }, [status, hasUser, queryClient]);

  return null;
}
