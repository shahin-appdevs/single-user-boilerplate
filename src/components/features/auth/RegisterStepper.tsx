"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const LABELS = ["Account", "Verify", "Details", "KYC"];

// Dot + connector stepper. Role gradient drives active/done states.
export function RegisterStepper({ step }: { step: number }) {
  return (
    <div className="mb-6 flex items-center gap-1.5">
      {LABELS.map((label, i) => {
        const on = i === step;
        const done = i < step;
        return (
          <div key={label} className="flex flex-1 items-center gap-1.5">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold transition-all",
                on || done
                  ? "border-transparent"
                  : "border-border bg-muted text-muted-foreground",
                on && "text-white",
              )}
              style={
                on
                  ? { backgroundImage: "var(--grad)" }
                  : done
                    ? {
                        backgroundColor:
                          "color-mix(in srgb, var(--primary) 18%, transparent)",
                        color: "var(--primary)",
                      }
                    : undefined
              }
            >
              {done ? <Check className="size-3.5" /> : i + 1}
            </span>
            {i < LABELS.length - 1 && (
              <span className="h-0.5 flex-1 overflow-hidden rounded bg-border">
                <span
                  className="block h-full transition-all duration-300"
                  style={{
                    width: done ? "100%" : "0%",
                    backgroundImage: "var(--grad)",
                  }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
