"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { kycStepSchema } from "@/lib/validators/auth";
import { authService } from "@/services/_shared/authService";
import { isApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { AuthResponse } from "@/services/_shared/authService";
import type { KycOutcome } from "@/hooks/_shared/useRegisterFlow";
import { KycDropzone } from "../KycDropzone";
import { Button } from "@/components/ui/button";

type Slot = "nidFront" | "nidBack" | "selfie";
type Files = Record<Slot, File | null>;
type Errors = Partial<Record<Slot, string>>;

export function StepKyc({
  registrationId,
  onDone,
  onBack,
}: {
  registrationId: string;
  onDone: (outcome: KycOutcome) => void;
  onBack: () => void;
}) {
  const role = useAuthStore((s) => s.role);
  const [files, setFiles] = useState<Files>({
    nidFront: null,
    nidBack: null,
    selfie: null,
  });
  const [errors, setErrors] = useState<Errors>({});

  const docs = [
    ["nidFront", "ID document — front", "JPG / PNG", CreditCard],
    ["nidBack", "ID document — back", "JPG / PNG", CreditCard],
    ["selfie", "Selfie with ID", "JPG / PNG", Users],
  ] as const;

  const finish = (outcome: KycOutcome, res: AuthResponse) => {
    useAuthStore.getState().setSession({
      token: res.token,
      user: res.user,
      remember: true,
      role,
    });
    onDone(outcome);
  };

  const uploadMut = useMutation({
    mutationFn: authService.uploadKyc,
    onSuccess: (res) => finish("verified", res),
    onError: (err) =>
      toast.error(isApiError(err) ? err.message : "Upload failed."),
  });

  const skipMut = useMutation({
    mutationFn: authService.skipKyc,
    onSuccess: (res) => finish("pending", res),
    onError: (err) =>
      toast.error(isApiError(err) ? err.message : "Something went wrong."),
  });

  const pending = uploadMut.isPending || skipMut.isPending;

  const onSelect = (slot: Slot) => (file: File) => {
    setFiles((f) => ({ ...f, [slot]: file }));
    setErrors((e) => ({ ...e, [slot]: undefined }));
  };

  const onSubmit = () => {
    const parsed = kycStepSchema.safeParse(files);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Slot;
        next[key] = next[key] ?? issue.message;
      }
      setErrors(next);
      return;
    }
    uploadMut.mutate({ registrationId, ...parsed.data });
  };

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

      <div className="mb-5">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Verify your identity
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          KYC keeps your money safe and unlocks higher limits.
        </p>
      </div>

      <div
        className="mb-4 flex gap-3 rounded-xl border p-3.5"
        style={{
          backgroundColor: "color-mix(in srgb, var(--primary) 9%, transparent)",
          borderColor: "color-mix(in srgb, var(--primary) 22%, transparent)",
        }}
      >
        <ShieldCheck
          className="size-5 shrink-0"
          style={{ color: "var(--primary)" }}
        />
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Your documents are encrypted and used only for verification. You can
          also do this later from your dashboard.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        {docs.map(([slot, label, hint, icon], i) => (
          <KycDropzone
            key={slot}
            label={label}
            hint={hint}
            icon={icon}
            value={files[slot]}
            onSelect={onSelect(slot)}
            error={errors[slot]}
            full={i === 2}
            disabled={pending}
          />
        ))}
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={pending}
        className="h-12 w-full text-white"
        style={{ backgroundImage: "var(--grad)" }}
      >
        {uploadMut.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            <ShieldCheck className="size-4" /> Submit &amp; finish
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={() => skipMut.mutate({ registrationId })}
        disabled={pending}
        className="mt-3.5 w-full p-2 text-center text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        {skipMut.isPending ? "Finishing…" : "Skip for now — verify later"}
      </button>
    </div>
  );
}
