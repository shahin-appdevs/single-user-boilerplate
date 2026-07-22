"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface QrImageProps {
  value: string;
  alt: string;
  className?: string;
}

/** Client-side QR via the dynamically imported `qrcode` lib. */
export function QrImage({ value, alt, className }: QrImageProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setSrc(null);
    import("qrcode")
      .then((mod) => mod.default.toDataURL(value, { width: 480, margin: 1 }))
      .then((url) => {
        if (active) setSrc(url);
      })
      .catch(() => {
        if (active) setSrc(null);
      });
    return () => {
      active = false;
    };
  }, [value]);

  const box = "size-50 sm:size-60";

  if (!src) return <Skeleton className={cn("rounded-lg", box)} />;

  // eslint-disable-next-line @next/next/no-img-element -- data-URL QR, not a remote asset
  return <img src={src} alt={alt} className={cn("block", box, className)} />;
}
