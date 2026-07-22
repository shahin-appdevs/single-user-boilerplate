import { useCallback, useEffect, useState } from "react";

type ResendTimer = {
  remaining: number;
  isActive: boolean;
  restart: () => void;
};

/** Countdown for OTP resend. Starts armed; `restart` re-arms after a resend. */
export function useResendTimer(seconds = 60): ResendTimer {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const restart = useCallback(() => setRemaining(seconds), [seconds]);

  return { remaining, isActive: remaining > 0, restart };
}
