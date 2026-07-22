"use client";

import { useQuery } from "@tanstack/react-query";

import { supportService, type SupportTicket } from "@/services/_shared/supportService";
import { queryKeys } from "@/lib/query/keys";

/** Read the current user's support tickets. */
export function useSupportTickets(enabled = true) {
  return useQuery<SupportTicket[]>({
    queryKey: queryKeys.shared.supportTickets(),
    queryFn: supportService.list,
    staleTime: 60_000,
    enabled,
  });
}
