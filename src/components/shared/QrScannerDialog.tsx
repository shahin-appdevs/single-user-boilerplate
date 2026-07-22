"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UseQrScannerReturn } from "@/hooks/user/useQrScanner";

const SCANNER_ID = "qr-scanner-region";

type Props = Pick<UseQrScannerReturn, "isOpen" | "close" | "onScan" | "onError">;

export function QrScannerDialog({ isOpen, close, onScan, onError }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const runningRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function stop(scanner: Html5Qrcode) {
      if (!runningRef.current) return;
      runningRef.current = false;
      try {
        await scanner.stop();
        scanner.clear();
      } catch {}
    }

    // Wait for dialog portal to paint the target div
    const timer = setTimeout(async () => {
      if (cancelled) return;
      try {
        const scanner = new Html5Qrcode(SCANNER_ID);
        scannerRef.current = scanner;
        runningRef.current = true;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            if (cancelled) return;
            stop(scanner).then(() => onScan(decoded));
          },
          undefined,
        );
      } catch (err) {
        if (!cancelled) {
          onError(err instanceof Error ? err.message : "Camera unavailable");
        }
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (scannerRef.current) stop(scannerRef.current);
    };
  }, [isOpen, onScan, onError]);

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-sm gap-4 p-5">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Scan QR Code</DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl bg-black">
          <div id={SCANNER_ID} className="w-full" />
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Point camera at a QR code to scan
        </p>
      </DialogContent>
    </Dialog>
  );
}
