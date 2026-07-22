"use client";

import { useCallback } from "react";

export type ShareResult = "shared" | "copied" | "aborted" | "error";

export type SharePayload = { title?: string; text?: string; url: string };

/** Share via the Web Share API, falling back to clipboard copy. */
export function useShare() {
  return useCallback(async (data: SharePayload): Promise<ShareResult> => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return "shared";
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return "aborted";
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(data.url);
      return "copied";
    } catch {
      return "error";
    }
  }, []);
}
