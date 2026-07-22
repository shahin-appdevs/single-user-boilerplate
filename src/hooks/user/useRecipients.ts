"use client";

import { useQuery } from "@tanstack/react-query";

import { recipientService, type Recipient } from "@/services/dashboard/recipientService";
import { queryKeys } from "@/lib/query/keys";

/** Read the current user's saved recipients. */
export function useRecipients(enabled = true) {
  return useQuery<Recipient[]>({
    queryKey: queryKeys.personal.recipients(),
    queryFn: recipientService.list,
    staleTime: 60_000,
    enabled,
  });
}
