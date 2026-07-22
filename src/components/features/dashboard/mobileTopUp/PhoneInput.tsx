"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { COUNTRIES, findCountry } from "@/constants/countries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Country dropdown + national number, styled like the shared AmountField. */
export function PhoneInput({
  country,
  onCountryChange,
  value,
  onChange,
  placeholder,
  invalid = false,
}: {
  country: string;
  onCountryChange: (code: string) => void;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  invalid?: boolean;
}) {
  const selected = findCountry(country);

  return (
    <div
      dir="ltr"
      className={cn(
        "flex h-11 items-center gap-2 rounded-lg bg-muted/40 px-3 transition-colors focus-within:ring-3 focus-within:ring-ring/50",
        invalid && "ring-2 ring-destructive",
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Country"
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span>{selected.dial}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-64 min-w-56 overflow-y-auto">
          {COUNTRIES.map((c) => (
            <DropdownMenuItem key={c.code} onSelect={() => onCountryChange(c.code)} className="gap-2.5">
              <span className="text-base leading-none">{c.flag}</span>
              <span className="flex-1">{c.name}</span>
              <span className="text-muted-foreground">{c.dial}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <span aria-hidden className="h-5 w-px shrink-0 bg-border" />

      <input
        type="tel"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
