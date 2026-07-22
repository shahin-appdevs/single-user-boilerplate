"use client";

import { useCallback, useState } from "react";

export type QrScannerState = "idle" | "open" | "scanning" | "error";

export type UseQrScannerReturn = {
  isOpen: boolean;
  state: QrScannerState;
  open: () => void;
  close: () => void;
  onScan: (result: string) => void;
  onError: (err: string) => void;
  error: string | null;
};

export function useQrScanner(onResult: (value: string) => void): UseQrScannerReturn {
  const [state, setState] = useState<QrScannerState>("idle");
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(() => {
    setError(null);
    setState("open");
  }, []);

  const close = useCallback(() => {
    setState("idle");
    setError(null);
  }, []);

  const onScan = useCallback(
    (result: string) => {
      onResult(result);
      setState("idle");
    },
    [onResult],
  );

  const onError = useCallback((err: string) => {
    setError(err);
    setState("error");
  }, []);

  return {
    isOpen: state === "open" || state === "scanning" || state === "error",
    state,
    open,
    close,
    onScan,
    onError,
    error,
  };
}
