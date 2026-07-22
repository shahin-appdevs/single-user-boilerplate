"use client";

import { useEffect, useState } from "react";
import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const formatSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const truncate = (name: string): string =>
  name.length > 22 ? `${name.slice(0, 20)}…` : name;

// Single upload tile, reused 3×. Tap to select/replace. Shows thumb + meta.
export function KycDropzone({
  label,
  hint,
  icon: Icon,
  value,
  onSelect,
  error,
  full,
  disabled,
}: {
  label: string;
  hint: string;
  icon: LucideIcon;
  value: File | null;
  onSelect: (file: File) => void;
  error?: string;
  full?: boolean;
  disabled?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value && value.type.startsWith("image/")) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [value]);

  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-muted p-5 text-center transition-colors hover:border-[var(--primary)]",
        value && "border-solid",
        error && "border-destructive",
        full && "col-span-full",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        disabled={disabled}
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
        }}
      />
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="size-12 rounded-lg object-cover"
        />
      ) : (
        <span
          className="grid size-10 place-items-center rounded-xl border border-border bg-background"
          style={{ color: "var(--primary)" }}
        >
          {value ? <Check className="size-5" /> : <Icon className="size-5" />}
        </span>
      )}
      <span className="text-sm font-semibold">{value ? "Uploaded" : label}</span>
      <span className="text-xs text-muted-foreground">
        {value ? `${truncate(value.name)} · ${formatSize(value.size)}` : hint}
      </span>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}
