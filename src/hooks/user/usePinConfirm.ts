"use client";

import { useCallback, useState } from "react";

export type PinConfirmState = "idle" | "open" | "submitting" | "error";

export type UsePinConfirmReturn = {
  isOpen: boolean;
  state: PinConfirmState;
  error: string | null;
  open: () => void;
  close: () => void;
  submit: (pin: string) => Promise<void>;
};

export function usePinConfirm(
  onConfirm: (pin: string) => Promise<void>,
): UsePinConfirmReturn {
  const [state, setState] = useState<PinConfirmState>("idle");
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(() => {
    setError(null);
    setState("open");
  }, []);

  const close = useCallback(() => {
    setState("idle");
    setError(null);
  }, []);

  const submit = useCallback(
    async (pin: string) => {
      setState("submitting");
      setError(null);
      try {
        await onConfirm(pin);
        setState("idle");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Incorrect PIN");
        setState("error");
      }
    },
    [onConfirm],
  );

  return {
    isOpen: state !== "idle",
    state,
    error,
    open,
    close,
    submit,
  };
}
