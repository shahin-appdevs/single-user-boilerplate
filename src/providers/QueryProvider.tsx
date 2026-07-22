"use client";

import { useState } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { isApiError } from "@/lib/api";
import { AuthEventsBridge } from "./AuthEventsBridge";

const logDevError = (error: unknown) => {
  // 401s are handled by the axios interceptor + AuthEventsBridge; ignore here.
  if (isApiError(error) && error.isAuth) return;
  if (process.env.NODE_ENV !== "production") {
    console.error("[query]", error);
  }
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: logDevError }),
        mutationCache: new MutationCache({ onError: logDevError }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: (failureCount, error) => {
              if (
                isApiError(error) &&
                (error.isAuth ||
                  error.status === 404 ||
                  error.status === 422)
              ) {
                return false;
              }
              return failureCount < 2;
            },
          },
          mutations: {
            // Money mutations never auto-retry.
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <AuthEventsBridge />
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
