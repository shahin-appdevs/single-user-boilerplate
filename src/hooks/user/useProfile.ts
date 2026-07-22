"use client";

import { useQuery } from "@tanstack/react-query";

import { profileService, type Profile } from "@/services/_shared/profileService";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/store/authStore";

/** Read the current user's profile. Seeds from the auth store when present. */
export function useProfile(enabled = true) {
  const cached = useAuthStore((s) => s.user);
  return useQuery<Profile>({
    queryKey: queryKeys.shared.profile(),
    queryFn: profileService.getMe,
    initialData: cached ?? undefined,
    staleTime: 60_000,
    enabled,
  });
}
