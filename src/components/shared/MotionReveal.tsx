"use client";

import type { ReactNode } from "react";

import { useGsapReveal } from "@/hooks/_shared/useGsapReveal";

export type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /** Replay on every scroll into view (default true). */
  repeat?: boolean;
};

/**
 * Fades + lifts its children into view on scroll (GSAP ScrollTrigger). Wraps
 * server-rendered children, so it can be dropped around any block; use `delay`
 * to stagger siblings.
 */
export function MotionReveal({
  children,
  className,
  delay = 0,
  y = 20,
  repeat = true,
}: MotionRevealProps) {
  const ref = useGsapReveal<HTMLDivElement>({ delay, y, repeat });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
