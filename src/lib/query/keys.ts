/**
 * Centralized TanStack Query keys, grouped by role. Each group exposes `.all`
 * for whole-group invalidation; `shared` holds cross-role keys.
 */
export type TxnFilters = {
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
};

export const queryKeys = {
  shared: {
    all: ["shared"] as const,
    profile: () => [...queryKeys.shared.all, "profile"] as const,
    supportTickets: () => [...queryKeys.shared.all, "support-tickets"] as const,
  },
  personal: {
    all: ["personal"] as const,
    balance: () => [...queryKeys.personal.all, "balance"] as const,
    transactions: (filters?: TxnFilters) =>
      [...queryKeys.personal.all, "transactions", filters ?? {}] as const,
    recipients: () => [...queryKeys.personal.all, "recipients"] as const,
    recipientFields: (type: string) =>
      [...queryKeys.personal.all, "recipients", "fields", type] as const,
  },
} as const;
