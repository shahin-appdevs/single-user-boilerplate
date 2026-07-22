import { useShallow } from "zustand/react/shallow";

import { useAuthStore } from "@/store/authStore";

/** Read-only convenience hook. Actions live on `useAuthStore.getState()`. */
export function useAuth() {
  return useAuthStore(
    useShallow((s) => ({
      status: s.status,
      user: s.user,
      isAuthenticated: s.status === "authenticated",
      isLoading: s.status === "unknown",
    })),
  );
}
