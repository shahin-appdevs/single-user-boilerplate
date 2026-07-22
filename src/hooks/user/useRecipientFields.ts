"use client";

import { useQuery } from "@tanstack/react-query";

import { recipientService, type RecipientField } from "@/services/dashboard/recipientService";
import { queryKeys } from "@/lib/query/keys";

/** Dynamic field schema for a recipient transaction type. */
export function useRecipientFields(type: string, enabled = true) {
  return useQuery<RecipientField[]>({
    queryKey: queryKeys.personal.recipientFields(type),
    queryFn: () => recipientService.fields(type),
    staleTime: 5 * 60_000,
    enabled: enabled && !!type,
  });
}
