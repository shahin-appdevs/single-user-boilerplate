"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/_shared/useReveal";

export type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
};

/**
 * Fades + lifts children into view on scroll. Default hidden state is
 * `opacity-0 translate-y-6`; reduced motion reveals instantly via the hook.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-revealed={revealed}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "translate-y-6 opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
        "data-[revealed=true]:translate-y-0 data-[revealed=true]:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
