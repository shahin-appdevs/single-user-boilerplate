"use client";

import * as React from "react";
import { OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";

import { cn } from "@/lib/utils";
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  allowPaste?: boolean;
  "aria-invalid"?: boolean;
};

// Masked slot — renders a dot, never the digit. Mirrors ui/InputOTPSlot styling.
function MaskedSlot({
  index,
  ariaInvalid,
}: {
  index: number;
  ariaInvalid?: boolean;
}) {
  const ctx = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = ctx?.slots[index] ?? {};

  return (
    <div
      data-active={isActive}
      aria-invalid={ariaInvalid}
      className={cn(
        "relative flex size-10 items-center justify-center rounded-xl border border-input text-lg outline-none transition-all sm:size-12",
        "data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:bg-input/30",
      )}
    >
      {char ? <span className="size-2.5 rounded-full bg-foreground" /> : null}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

// 6-box masked PIN entry. Paste blocked. Always LTR. Never logged.
export function PinInput({
  value,
  onChange,
  length = 6,
  disabled,
  autoFocus,
  allowPaste = false,
  "aria-invalid": ariaInvalid,
}: Props) {
  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoFocus={autoFocus}
      dir="ltr"
      inputMode="numeric"
      pattern={REGEXP_ONLY_DIGITS}
      onPaste={allowPaste ? undefined : (e) => e.preventDefault()}
      aria-invalid={ariaInvalid}
      containerClassName="justify-center gap-1.5 sm:gap-2.5"
    >
      <InputOTPGroup className="gap-1.5 sm:gap-2.5">
        {Array.from({ length }).map((_, i) => (
          <MaskedSlot key={i} index={i} ariaInvalid={ariaInvalid} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
