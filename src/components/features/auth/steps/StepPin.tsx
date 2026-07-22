"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { pinStepSchema, type PinValues } from "@/lib/validators/auth";
import { authService } from "@/services/_shared/authService";
import { isApiError } from "@/lib/api";
import { PinInput } from "@/components/primitives/PinInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function StepPin({
  registrationId,
  onDone,
  onBack,
}: {
  registrationId: string;
  onDone: () => void;
  onBack: () => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PinValues>({
    resolver: zodResolver(pinStepSchema),
    defaultValues: { pin: "", confirmPin: "" },
  });

  const setPinMut = useMutation({
    mutationFn: authService.setPin,
    onSuccess: onDone,
    onError: (err) =>
      toast.error(isApiError(err) ? err.message : "Could not set PIN."),
  });

  const onSubmit = handleSubmit((values) => {
    setPinMut.mutate({ registrationId, pin: values.pin });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col" noValidate>
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
          Set your PIN
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          You&apos;ll use this 6-digit PIN to confirm payments.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-2">
        <Label>Create PIN</Label>
        <Controller
          control={control}
          name="pin"
          render={({ field }) => (
            <PinInput
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.pin}
              disabled={setPinMut.isPending}
              autoFocus
            />
          )}
        />
        {errors.pin && (
          <p className="text-center text-sm text-destructive">
            {errors.pin.message}
          </p>
        )}
      </div>

      <div className="mb-5 flex flex-col gap-2">
        <Label>Confirm PIN</Label>
        <Controller
          control={control}
          name="confirmPin"
          render={({ field }) => (
            <PinInput
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.confirmPin}
              disabled={setPinMut.isPending}
            />
          )}
        />
        {errors.confirmPin && (
          <p className="text-center text-sm text-destructive">
            {errors.confirmPin.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={setPinMut.isPending}
        className="h-12 w-full text-white"
        style={{ backgroundImage: "var(--grad)" }}
      >
        {setPinMut.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            Continue <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
