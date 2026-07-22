"use client";

import { useEffect, useRef, useState } from "react";

export type CountUpProps = {
  to: number;
  decimals?: number;
  suffix?: string;
  durationMs?: number;
};

/** Counts from 0 → `to` once scrolled into view. Snaps to final value when
 * reduced motion is preferred. */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  durationMs = 1600,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setValue(to);
      return;
    }

    let raf = 0;
    let start = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(to * eased);
          if (p < 1) raf = requestAnimationFrame(step);
          else setValue(to);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, durationMs]);

  return (
    <span ref={ref} dir="ltr">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
