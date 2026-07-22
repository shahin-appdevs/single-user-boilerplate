"use client";

import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  skeleton?: ReactNode;
  errorText?: string;
  retryText?: string;
  children: ReactNode;
}

/** Standard wrapper: skeleton while loading, error + retry on failure. */
export function QueryState({
  isLoading,
  isError,
  onRetry,
  skeleton,
  errorText = "Something went wrong",
  retryText = "Retry",
  children,
}: QueryStateProps) {
  if (isLoading) return <>{skeleton}</>;

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="size-5 text-destructive" />
        </span>
        <p className="text-sm text-muted-foreground">{errorText}</p>
        {onRetry && (
          <Button variant="outline" size="sm" className="h-9" onClick={onRetry}>
            {retryText}
          </Button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
