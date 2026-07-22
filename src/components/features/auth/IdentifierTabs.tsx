"use client";

import { Mail, Phone } from "lucide-react";

import { cn } from "@/lib/utils";

export type IdentifierMethod = "email" | "phone";

const TABS: { key: IdentifierMethod; label: string; icon: typeof Mail }[] = [
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
];

// Email / Phone segmented tabs (controlled).
export function IdentifierTabs({
  value,
  onChange,
}: {
  value: IdentifierMethod;
  onChange: (method: IdentifierMethod) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
      {TABS.map(({ key, label, icon: Icon }) => {
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={cn(
              "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
