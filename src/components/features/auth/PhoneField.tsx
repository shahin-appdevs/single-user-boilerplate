"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { COUNTRIES, findCountry } from "@/constants/countries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Country dropdown (searchable) + national number. Always LTR. National value
// validated against the selected country in the Zod schema.
export function PhoneField({
  country,
  onCountryChange,
  phoneRegister,
  invalid,
  disabled,
}: {
  country: string;
  onCountryChange: (code: string) => void;
  phoneRegister: UseFormRegisterReturn;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const selected = findCountry(country);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [query]);

  // Reset the highlight whenever the result set changes.
  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row scrolled into view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (code: string) => {
    onCountryChange(code);
    setOpen(false);
    setQuery("");
  };

  const onSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[active];
      if (c) choose(c.code);
    }
  };

  return (
    <div
      dir="ltr"
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-input bg-card px-3.5 py-3 transition-[border-color,box-shadow] focus-within:border-(--primary) focus-within:ring-4 focus-within:ring-[color-mix(in_srgb,var(--primary)_18%,transparent)]",
        invalid && "border-destructive ring-2 ring-destructive",
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          aria-label="Country"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span>{selected.dial}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0" sideOffset={10}>
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search country"
              className="h-10 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <div ref={listRef} className="max-h-64 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No country found.
              </p>
            ) : (
              filtered.map((c, i) => (
                <button
                  key={c.code}
                  type="button"
                  data-idx={i}
                  onClick={() => choose(c.code)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-start text-sm transition-colors",
                    i === active
                      ? "bg-secondary-foreground/10 text-secondary-foreground"
                      : "text-secondary-foreground/80",
                  )}
                >
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-muted-foreground">{c.dial}</span>
                  {c.code === country ? (
                    <Check className="size-4 text-primary" />
                  ) : null}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      <span aria-hidden className="h-5 w-px bg-border" />

      <input
        {...phoneRegister}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={selected.example}
        disabled={disabled}
        className="min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
