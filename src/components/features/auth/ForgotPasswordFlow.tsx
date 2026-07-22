"use client";

import { useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

import { Link } from "@/i18n/navigation";
import { findCountry, DEFAULT_COUNTRY } from "@/constants/countries";
import {
  forgotIdentifierSchema,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { useAuthStore } from "@/store/authStore";
import { useResendTimer } from "@/hooks/_shared/useResendTimer";
import { useStepTransition } from "@/hooks/_shared/useStepTransition";
import { OtpInput } from "@/components/primitives/OtpInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IdentifierTabs, type IdentifierMethod } from "./IdentifierTabs";
import { PhoneField } from "./PhoneField";

// Simulated network latency for the stubbed submits. Swap these blocks for
// real authService calls when the forgot-password endpoints are wired.
const fakeDelay = () => new Promise((r) => setTimeout(r, 800));

// +8801712345678 → +880 1•••••5678
const maskPhone = (phone: string): string => {
  if (phone.length < 6) return phone;
  return `${phone.slice(0, 5)}${"•".repeat(Math.max(0, phone.length - 9))}${phone.slice(-4)}`;
};

type Destination = { method: IdentifierMethod; value: string };

type IdentifierFormValues = {
  method: IdentifierMethod;
  role: "user";
  email: string;
  country: string;
  phone: string;
};

type ResetFormValues = {
  code: string;
  password: string;
  confirmPassword: string;
};

export function ForgotPasswordFlow() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [destination, setDestination] = useState<Destination | null>(null);
  const stepRef = useStepTransition<HTMLDivElement>(step);

  return (
    <div className="flex flex-col">
      <div key={step} ref={stepRef}>
        {step === 0 && (
          <IdentifierStep
            onSent={(dest) => {
              setDestination(dest);
              setStep(1);
            }}
          />
        )}
        {step === 1 && destination && (
          <ResetStep
            destination={destination}
            onDone={() => setStep(2)}
            onBack={() => setStep(0)}
          />
        )}
        {step === 2 && <DoneStep />}
      </div>
    </div>
  );
}

// Step 0 — pick role + identifier, request the reset code.
function IdentifierStep({ onSent }: { onSent: (dest: Destination) => void }) {
  const role = useAuthStore((s) => s.role);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IdentifierFormValues>({
    resolver: zodResolver(
      forgotIdentifierSchema,
    ) as unknown as Resolver<IdentifierFormValues>,
    defaultValues: {
      method: "phone",
      role,
      email: "",
      country: DEFAULT_COUNTRY.code,
      phone: "",
    },
  });

  const method = watch("method");
  const country = watch("country");
  const email = watch("email");
  const phone = watch("phone");
  const canSubmit = method === "email" ? !!email : !!phone;

  const onSubmit = handleSubmit(async (values) => {
    setPending(true);
    try {
      // STUB: replace with authService.forgotPassword({ role, ... }).
      await fakeDelay();
      const dest: Destination =
        values.method === "email"
          ? { method: "email", value: values.email }
          : {
              method: "phone",
              value: `${findCountry(values.country).dial}${values.phone.replace(/\D/g, "")}`,
            };
      toast.success("Reset code sent.");
      onSent(dest);
    } finally {
      setPending(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col" noValidate>
      <Link
        href="/login"
        className="mb-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to log in
      </Link>

      <div className="mb-6">
        <span
          className="mb-3 inline-flex items-center gap-2 text-[13px] font-semibold"
          style={{ color: "var(--primary)" }}
        >
          <i
            className="grid size-6 place-items-center rounded-lg"
            style={{
              backgroundColor: "color-mix(in srgb, var(--primary) 14%, transparent)",
            }}
          >
            <KeyRound className="size-4" />
          </i>
          Password recovery
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Forgot your password?
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Enter your account details and we&apos;ll send you a code to reset it.
        </p>
      </div>

      <div className="mb-4">
        <IdentifierTabs value={method} onChange={(m) => setValue("method", m)} />
      </div>

      {method === "email" ? (
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="you@email.com"
              aria-invalid={!!errors.email}
              className="h-12 border-0 bg-muted/50 ps-9"
              disabled={pending}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
      ) : (
        <div className="mb-4 flex flex-col gap-2">
          <Label>Phone number</Label>
          <PhoneField
            country={country}
            onCountryChange={(c) => setValue("country", c)}
            phoneRegister={register("phone")}
            invalid={!!errors.phone}
            disabled={pending}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={pending || !canSubmit}
        className="mt-1 h-12 w-full border-0 text-white shadow-md transition-all hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_14px_32px_-10px_var(--primary)] active:translate-y-0 disabled:translate-y-0 disabled:shadow-none"
        style={{ backgroundImage: "var(--grad)" }}
      >
        {pending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            Send reset code <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-bold"
          style={{ color: "var(--primary)" }}
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

// Step 1 — enter the code + choose a new password.
function ResetStep({
  destination,
  onDone,
  onBack,
}: {
  destination: Destination;
  onDone: () => void;
  onBack: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { remaining, isActive, restart } = useResendTimer(60);

  const DestIcon = destination.method === "phone" ? Phone : Mail;
  const shownDest =
    destination.method === "phone"
      ? maskPhone(destination.value)
      : destination.value;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(
      resetPasswordSchema,
    ) as unknown as Resolver<ResetFormValues>,
    defaultValues: { code: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async () => {
    setPending(true);
    try {
      // STUB: replace with authService.resetPassword({ ... }).
      await fakeDelay();
      onDone();
    } finally {
      setPending(false);
    }
  });

  const resend = async () => {
    setResending(true);
    try {
      // STUB: replace with authService.resendForgotOtp({ ... }).
      await fakeDelay();
      restart();
      toast.success("Code sent.");
    } finally {
      setResending(false);
    }
  };

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
          Reset your password
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

      <div className="mb-2 flex flex-col gap-2">
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <OtpInput
              value={field.value}
              onChange={field.onChange}
              disabled={pending}
              aria-invalid={!!errors.code}
            />
          )}
        />
        {errors.code && (
          <p className="text-center text-sm text-destructive">
            {errors.code.message}
          </p>
        )}
      </div>

      <p className="mb-5 text-center text-sm text-muted-foreground">
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
            onClick={resend}
            disabled={resending}
            className="font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Resend code
          </button>
        )}
      </p>

      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            className="h-12 border-0 bg-muted/50 px-9"
            disabled={pending}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 end-3 my-auto flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            aria-invalid={!!errors.confirmPassword}
            className="h-12 border-0 bg-muted/50 ps-9 pe-3"
            disabled={pending}
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="mt-1 h-12 w-full border-0 text-white shadow-md transition-all hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_14px_32px_-10px_var(--primary)] active:translate-y-0 disabled:translate-y-0 disabled:shadow-none"
        style={{ backgroundImage: "var(--grad)" }}
      >
        {pending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            Reset password <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}

// Step 2 — success.
function DoneStep() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span
        className="grid size-16 place-items-center rounded-2xl"
        style={{
          backgroundColor: "color-mix(in srgb, var(--primary) 14%, transparent)",
          color: "var(--primary)",
        }}
      >
        <CheckCircle2 className="size-8" />
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight">
        Password reset
      </h1>
      <p className="max-w-[34ch] text-[15px] text-muted-foreground">
        Your password has been updated. You can now log in with your new
        password.
      </p>
      <Button
        asChild
        className="mt-2 h-12 w-full border-0 text-white"
        style={{ backgroundImage: "var(--grad)" }}
      >
        <Link href="/login">
          Back to log in <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
