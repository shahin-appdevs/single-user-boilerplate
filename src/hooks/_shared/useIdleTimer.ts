import { useCallback, useEffect, useRef } from "react";

type Options = {
  timeoutMs: number;
  warningMs: number;
  onWarn: () => void;
  onTimeout: () => void;
  enabled: boolean;
};

type IdleTimer = {
  reset: () => void;
  remainingMs: () => number;
};

const ACTIVITY_EVENTS = [
  "mousemove",
  "keydown",
  "touchstart",
  "click",
  "scroll",
] as const;

const THROTTLE_MS = 1000;

/**
 * Pure timing primitive. No store imports. Tracks user activity on `window`
 * and fires `onWarn` at `timeoutMs - warningMs`, `onTimeout` at `timeoutMs`.
 */
export function useIdleTimer({
  timeoutMs,
  warningMs,
  onWarn,
  onTimeout,
  enabled,
}: Options): IdleTimer {
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deadline = useRef<number>(0);
  const lastActivity = useRef<number>(0);

  // Keep callbacks fresh without re-subscribing listeners.
  const onWarnRef = useRef(onWarn);
  const onTimeoutRef = useRef(onTimeout);
  onWarnRef.current = onWarn;
  onTimeoutRef.current = onTimeout;

  const clearTimers = useCallback(() => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
    warnTimer.current = null;
    timeoutTimer.current = null;
  }, []);

  const arm = useCallback(() => {
    clearTimers();
    deadline.current = Date.now() + timeoutMs;
    warnTimer.current = setTimeout(() => {
      onWarnRef.current();
    }, Math.max(0, timeoutMs - warningMs));
    timeoutTimer.current = setTimeout(() => {
      onTimeoutRef.current();
    }, timeoutMs);
  }, [clearTimers, timeoutMs, warningMs]);

  const reset = useCallback(() => {
    arm();
  }, [arm]);

  const remainingMs = useCallback(() => {
    return Math.max(0, deadline.current - Date.now());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled) {
      clearTimers();
      return;
    }

    arm();

    const onActivity = () => {
      const now = Date.now();
      if (now - lastActivity.current < THROTTLE_MS) return;
      lastActivity.current = now;
      arm();
    };

    const onVisibility = () => {
      // Treat a tab return as activity.
      if (document.visibilityState === "visible") arm();
    };

    for (const evt of ACTIVITY_EVENTS) {
      window.addEventListener(evt, onActivity, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimers();
      for (const evt of ACTIVITY_EVENTS) {
        window.removeEventListener(evt, onActivity);
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, arm, clearTimers]);

  return { reset, remainingMs };
}
