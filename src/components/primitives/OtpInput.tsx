"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-invalid"?: boolean;
};

// 6-box unmasked code entry. Paste-to-fill allowed. Always LTR.
export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  autoFocus,
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
      aria-invalid={ariaInvalid}
      containerClassName="justify-center gap-2.5"
    >
      <InputOTPGroup className="gap-2.5">
        {Array.from({ length }).map((_, i) => (
          <InputOTPSlot
            key={i}
            index={i}
            aria-invalid={ariaInvalid}
            className="size-12 rounded-xl border font-mono text-lg"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
