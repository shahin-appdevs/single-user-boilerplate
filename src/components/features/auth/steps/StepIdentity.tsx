"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

import { Link } from "@/i18n/navigation";
import { DEFAULT_COUNTRY, findCountry } from "@/constants/countries";
import {
  identifierStepSchema,
  type IdentifierValues,
} from "@/lib/validators/auth";
import { authService } from "@/services/_shared/authService";
import { isApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { ROLE_META } from "../roleConfig";
import { IdentifierTabs, type IdentifierMethod } from "../IdentifierTabs";
import { PhoneField } from "../PhoneField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

type IdentifierFormValues = {
  method: IdentifierMethod;
  country: string;
  phone: string;
  email: string;
  acceptTerms: boolean;
};

export function StepIdentity({
  onDone,
}: {
  onDone: (registrationId: string, values: IdentifierValues) => void;
}) {
  const role = useAuthStore((s) => s.role);
  const meta = ROLE_META[role];

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<IdentifierFormValues>({
    resolver: zodResolver(
      identifierStepSchema,
    ) as unknown as Resolver<IdentifierFormValues>,
    defaultValues: {
      method: "phone",
      country: DEFAULT_COUNTRY.code,
      phone: "",
      email: "",
      acceptTerms: false,
    },
  });

  const method = watch("method");
  const country = watch("country");
  const acceptTerms = watch("acceptTerms");
  const email = watch("email");
  const phone = watch("phone");

  // Enable submit only once the identifier is filled and terms accepted.
  const canSubmit =
    acceptTerms && (method === "email" ? !!email : !!phone);

  const registerMut = useMutation({
    mutationFn: authService.register,
    onError: (err) => {
      if (isApiError(err) && err.fields) {
        const { email, phone } = err.fields;
        if (email) setError("email", { message: email[0] });
        if (phone) setError("phone", { message: phone[0] });
        if (email || phone) return;
      }
      toast.error(isApiError(err) ? err.message : "Something went wrong.");
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const identifier: IdentifierValues =
      values.method === "email"
        ? { method: "email", email: values.email, acceptTerms: true }
        : {
            method: "phone",
            country: values.country,
            phone: values.phone,
            acceptTerms: true,
          };

    try {
      const res = await registerMut.mutateAsync(
        identifier.method === "email"
          ? { role, method: "email", email: identifier.email }
          : {
              role,
              method: "phone",
              phone: `${findCountry(identifier.country).dial}${identifier.phone.replace(/\D/g, "")}`,
            },
      );
      onDone(res.registrationId, identifier);
    } catch {
      // onError already surfaced the failure
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col" noValidate>
      <div className="mb-6">
        <span
          className="mb-3 inline-flex items-center gap-2 text-[13px] font-semibold"
          style={{ color: "var(--primary)" }}
        >
          <i
            className="grid size-6 place-items-center rounded-lg"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--primary) 14%, transparent)",
            }}
          >
            <meta.icon className="size-4" />
          </i>
          {meta.kicker}
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Sign up with your phone or email. We&apos;ll send a one-time code to
          verify it&apos;s you.
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
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      )}

      <label className="mb-4 inline-flex cursor-pointer items-start gap-2 text-[13px] text-muted-foreground">
        <Checkbox
          checked={acceptTerms}
          onCheckedChange={(v) => setValue("acceptTerms", v === true)}
          aria-invalid={!!errors.acceptTerms}
          className="border-muted-foreground/50 data-[state=checked]:border-(--primary) data-[state=checked]:bg-(--primary) data-[state=checked]:text-white"
        />
        I agree to the Terms &amp; Privacy Policy
      </label>
      {errors.acceptTerms && (
        <p className="-mt-2 mb-3 text-sm text-destructive">
          {errors.acceptTerms.message}
        </p>
      )}

      <Button
        type="submit"
        disabled={registerMut.isPending || !canSubmit}
        className="h-12 w-full border-0 text-white shadow-md transition-all hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_14px_32px_-10px_var(--primary)] active:translate-y-0 disabled:translate-y-0 disabled:shadow-none"
        style={{ backgroundImage: "var(--grad)" }}
      >
        {registerMut.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            Send code{" "}
            <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
          </>
        )}
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
