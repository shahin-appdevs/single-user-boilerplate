"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  Loader2,
  Lock,
  Mail,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";

import { Link, useRouter } from "@/i18n/navigation";
import { findCountry, DEFAULT_COUNTRY } from "@/constants/countries";
import { loginSchema } from "@/lib/validators/auth";
import { authService, type LoginInput } from "@/services/_shared/authService";
import { isApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { roleHome } from "@/lib/dashboard/nav";
import { ROLE_META } from "./roleConfig";
import { IdentifierTabs, type IdentifierMethod } from "./IdentifierTabs";
import { PhoneField } from "./PhoneField";
// import { PinInput } from "@/components/primitives/PinInput"; // kept for future PIN login
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type LoginFormValues = {
  method: IdentifierMethod;
  role: "user";
  email: string;
  country: string;
  phone: string;
  // pin: string; // kept for future PIN login
  password: string;
  remember: boolean;
};

export function LoginForm() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const meta = ROLE_META[role];
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginFormValues>,
    defaultValues: {
      method: "phone",
      role,
      email: "",
      country: DEFAULT_COUNTRY.code,
      phone: "",
      password: "",
      remember: true,
    },
  });

  const method = watch("method");
  const country = watch("country");
  const remember = watch("remember");
  const email = watch("email");
  const phone = watch("phone");
  const password = watch("password");

  // Enable submit only once the required fields are filled.
  const canSubmit =
    !!password && (method === "email" ? !!email : !!phone);

  // Keep the hidden role field synced with the store's RoleTabs selection.
  useEffect(() => setValue("role", role), [role, setValue]);

  const loginMut = useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      useAuthStore.getState().setSession({
        token: res.token,
        user: res.user,
        remember: watch("remember"),
        role,
      });
      const dest = useAuthStore.getState().intendedPath ?? roleHome(role);
      useAuthStore.getState().setIntendedPath(null);
      router.replace(dest);
    },
    onError: (err) => {
      if (isApiError(err) && err.fields) {
        const { email, phone, password } = err.fields;
        if (email) setError("email", { message: email[0] });
        if (phone) setError("phone", { message: phone[0] });
        if (password) setError("password", { message: password[0] });
        if (email || phone || password) return;
      }
      toast.error(isApiError(err) ? err.message : "Something went wrong.");
    },
  });

  const onSubmit = handleSubmit(() => {
    // TEMPORARY: no auth API yet — go straight to the role's dashboard.
    // Restore `loginMut.mutate(input)` (see below) when login is wired.
    router.replace(roleHome(role));
  });

  // FUTURE: real login mutation.
  // const input: LoginInput =
  //   values.method === "email"
  //     ? { role, method: "email", email: values.email, password: values.password, remember: values.remember }
  //     : { role, method: "phone", phone: `${findCountry(values.country).dial}${values.phone.replace(/\D/g, "")}`, password: values.password, remember: values.remember };
  // loginMut.mutate(input);

  return (
    <form onSubmit={onSubmit} className="flex flex-col" noValidate>
      <div className="mb-6">
        <span
          className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold tracking-[0.06em] uppercase"
          style={{
            color: "var(--primary)",
            borderColor: "color-mix(in srgb, var(--primary) 30%, transparent)",
            backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)",
          }}
        >
          <meta.icon className="size-3.5" />
          {meta.kicker}
        </span>
        <h1 className="font-hero text-[clamp(34px,4vw,44px)] leading-[1.1] font-bold tracking-tight">
          Welcome <em className="italic" style={{ color: "var(--primary)" }}>back</em>.
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Log in to your CrypInvest {meta.label.toLowerCase()} account.
        </p>
      </div>

      <div className="mb-4">
        <IdentifierTabs
          value={method}
          onChange={(m) => setValue("method", m)}
        />
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
              className="h-12 rounded-xl border border-input bg-card ps-9 transition-[border-color,box-shadow] placeholder:text-muted-foreground/50 focus-visible:border-(--primary) focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--primary)_18%,transparent)]"
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

      {/* Password credential. PIN-based login kept below (commented) for future use. */}
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Forgot?
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            className="h-12 rounded-xl border border-input bg-card px-9 transition-[border-color,box-shadow] placeholder:text-muted-foreground/50 focus-visible:border-(--primary) focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--primary)_18%,transparent)]"
            disabled={loginMut.isPending}
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

      {/* FUTURE: PIN-based login — restore PinInput, the `pin` field on
          LoginFormValues, pinSchema in loginSchema, and `pin` on LoginInput.
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>PIN</Label>
          <Link
            href="/forgot-pin"
            className="text-sm font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Forgot?
          </Link>
        </div>
        <Controller
          control={control}
          name="pin"
          render={({ field }) => (
            <PinInput
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.pin}
              disabled={loginMut.isPending}
            />
          )}
        />
        {errors.pin && (
          <p className="text-center text-sm text-destructive">
            {errors.pin.message}
          </p>
        )}
      </div>
      */}

      <label className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
        <Checkbox
          checked={remember}
          onCheckedChange={(v) => setValue("remember", v === true)}
          className="border-muted-foreground/50 data-[state=checked]:border-(--primary) data-[state=checked]:bg-(--primary) data-[state=checked]:text-white"
        />
        Keep me signed in
      </label>

      <Button
        type="submit"
        disabled={loginMut.isPending || !canSubmit}
        className="h-12 w-full border-0 text-white shadow-md transition-all hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_14px_32px_-10px_var(--primary)] active:translate-y-0 disabled:translate-y-0 disabled:shadow-none"
        style={{ backgroundImage: "var(--grad)" }}
      >
        {loginMut.isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            Log in{" "}
            <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
          </>
        )}
      </Button>

      <div className="my-5 flex items-center gap-3.5 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        or continue with
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {/* Social placeholders — no handlers yet. */}
        <Button
          type="button"
          variant="outline"
          className="h-11 border-0 bg-muted/50 transition-all hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm"
        >
          <Fingerprint className="size-4" /> Passkey
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 border-0 bg-muted/50 transition-all hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm"
        >
          <QrCode className="size-4" /> QR login
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to CrypInvest?{" "}
        <Link
          href="/register"
          className="font-bold"
          style={{ color: "var(--primary)" }}
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
