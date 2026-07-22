"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

import { authService } from "@/services/_shared/authService";
import { isApiError } from "@/lib/api";
import { otpSchema } from "@/lib/validators/auth";
import { useResendTimer } from "@/hooks/_shared/useResendTimer";
import { OtpInput } from "@/components/primitives/OtpInput";
import { Button } from "@/components/ui/button";

// +8801712345678 → +880 1•••••5678
const maskPhone = (phone: string): string => {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 5)}${"•".repeat(Math.max(0, phone.length - 9))}${phone.slice(-4)}`;
};

export function StepOtp({
  registrationId,
  destination,
  method,
  onVerified,
  onBack,
}: {
  registrationId: string;
  destination: string;
  method: "phone" | "email";
  onVerified: () => void;
  onBack: () => void;
}) {
  const DestIcon = method === "phone" ? Phone : Mail;
  const shownDest = method === "phone" ? maskPhone(destination) : destination;
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const submittingRef = useRef(false);
  const { remaining, isActive, restart } = useResendTimer(60);

  const verifyMut = useMutation({
    mutationFn: authService.verifyOtp,
    onError: (err) => {
      setCode("");
      setInvalid(true);
      toast.error(isApiError(err) ? err.message : "Invalid code.");
    },
  });

  const resendMut = useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: () => {
      restart();
      toast.success("Code sent.");
    },
    onError: (err) =>
      toast.error(isApiError(err) ? err.message : "Could not resend code."),
  });

  const submit = async (value: string) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      await verifyMut.mutateAsync({ registrationId, code: value });
      onVerified();
    } catch {
      // onError handles it
    } finally {
      submittingRef.current = false;
    }
  };

  // Auto-submit once the 6 digits are valid.
  useEffect(() => {
    if (otpSchema.safeParse(code).success && !submittingRef.current) {
      void submit(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Verify it&apos;s you
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Enter the 6-digit code we sent to
        </p>
      </div>

      <div className="mb-5 flex justify-center">
        <span
          dir="ltr"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3.5 py-2 text-sm font-semibold"
        >
          <DestIcon className="size-3.5" />
          {shownDest}
        </span>
      </div>

      <div className="mb-4">
        <OtpInput
          value={code}
          onChange={(v) => {
            setInvalid(false);
            setCode(v);
          }}
          disabled={verifyMut.isPending}
          autoFocus
          aria-invalid={invalid}
        />
      </div>

      <p className="mb-4 text-center text-sm text-muted-foreground">
        {isActive ? (
          <>
            Resend code in{" "}
            <b style={{ color: "var(--primary)" }}>
              0:{remaining.toString().padStart(2, "0")}
            </b>
          </>
        ) : (
          <button
            type="button"
            onClick={() => resendMut.mutate({ registrationId })}
            disabled={resendMut.isPending}
            className="font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Resend code
          </button>
        )}
      </p>

      <Button
        type="button"
        onClick={() => submit(code)}
        disabled={verifyMut.isPending || code.length < 6}
        className="h-12 w-full text-white"
        style={{ backgroundImage: "var(--grad)" }}
      >
        {verifyMut.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            Verify <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </div>
  );
}
