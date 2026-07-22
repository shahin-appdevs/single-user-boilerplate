import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api";
import { personalEndpoints } from "@/constants/api-endpoints";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

type UseLogout = {
  logout: () => Promise<void>;
  isPending: boolean;
};

export function useLogout(): UseLogout {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const logout = async () => {
    setIsPending(true);
    try {
      // Best-effort backend revocation; swallow failures.
      await apiRequest({ method: "POST", url: personalEndpoints.auth.logout });
    } catch {
      /* ignore */
    } finally {
      useAuthStore.getState().logout("manual");
      queryClient.clear();
      setIsPending(false);
      router.replace("/login");
    }
  };

  return { logout, isPending };
}
