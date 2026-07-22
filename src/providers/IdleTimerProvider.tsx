"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import { useIdleTimer } from "@/hooks/_shared/useIdleTimer";
import { IdleWarningDialog } from "@/components/shared/IdleWarningDialog";

const TIMEOUT_MS = 5 * 60 * 1000;
const WARNING_MS = 60 * 1000;

export function IdleTimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(Math.ceil(WARNING_MS / 1000));
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTick = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  }, []);

  const handleTimeout = useCallback(() => {
    stopTick();
    setShowWarning(false);
    useAuthStore.getState().logout("idle");
    toast(t("auth.idleLoggedOut"));
    router.replace("/login");
  }, [router, stopTick, t]);

  const { reset, remainingMs } = useIdleTimer({
    timeoutMs: TIMEOUT_MS,
    warningMs: WARNING_MS,
    enabled: status === "authenticated",
    onWarn: () => {
      setShowWarning(true);
      setCountdown(Math.ceil(remainingMs() / 1000));
      stopTick();
      tickRef.current = setInterval(() => {
        setCountdown(Math.ceil(remainingMs() / 1000));
      }, 1000);
    },
    onTimeout: handleTimeout,
  });

  // Tear the warning down if the session ends by any other path.
  useEffect(() => {
    if (status !== "authenticated") {
      stopTick();
      setShowWarning(false);
    }
  }, [status, stopTick]);

  useEffect(() => stopTick, [stopTick]);

  const handleStay = useCallback(() => {
    stopTick();
    setShowWarning(false);
    reset();
  }, [reset, stopTick]);

  return (
    <>
      {children}
      <IdleWarningDialog
        open={showWarning}
        secondsRemaining={countdown}
        onStay={handleStay}
        onLogout={handleTimeout}
      />
    </>
  );
}
