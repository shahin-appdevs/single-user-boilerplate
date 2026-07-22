"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { COUNTRIES, DEFAULT_COUNTRY, findCountry } from "@/constants/countries";
import { detailsStepSchema, type DetailsValues } from "@/lib/validators/auth";
import { authService } from "@/services/_shared/authService";
import { isApiError } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StepDetails({
  registrationId,
  onDone,
  onBack,
}: {
  registrationId: string;
  onDone: () => void;
  onBack: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<DetailsValues>({
    resolver: zodResolver(detailsStepSchema) as Resolver<DetailsValues>,
    defaultValues: {
      fullName: "",
      country: DEFAULT_COUNTRY.code,
      dateOfBirth: "",
      password: "",
    },
  });

  const country = watch("country");
  const selectedCountry = findCountry(country);

  const profileMut = useMutation({
    mutationFn: authService.setProfile,
    onSuccess: onDone,
    onError: (err) => {
      if (isApiError(err) && err.fields) {
        const { fullName, country: c, dateOfBirth, password } = err.fields;
        if (fullName) setError("fullName", { message: fullName[0] });
        if (c) setError("country", { message: c[0] });
        if (dateOfBirth) setError("dateOfBirth", { message: dateOfBirth[0] });
        if (password) setError("password", { message: password[0] });
        if (fullName || c || dateOfBirth || password) return;
      }
      toast.error(isApiError(err) ? err.message : "Could not save details.");
    },
  });

  const onSubmit = handleSubmit((values) => {
    profileMut.mutate({ registrationId, ...values });
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
          Tell us about you
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          A few details to set up your account.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Daniel Okafor"
            aria-invalid={!!errors.fullName}
            className="h-12 ps-9"
            {...register("fullName")}
          />
        </div>
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <Label>Country</Label>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Country"
            aria-invalid={!!errors.country}
            className={cn(
              "inline-flex h-12 items-center gap-2.5 rounded-xl border border-input bg-muted px-3.5 text-sm font-semibold outline-none transition-colors focus-visible:border-(--primary) aria-invalid:border-destructive",
            )}
          >
            <Globe className="size-4 text-muted-foreground" />
            <span className="text-base leading-none">
              {selectedCountry.flag}
            </span>
            <span className="flex-1 text-start">{selectedCountry.name}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-56">
            {COUNTRIES.map((c) => (
              <DropdownMenuItem
                key={c.code}
                onSelect={() => setValue("country", c.code)}
                className="gap-2.5"
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="flex-1">{c.name}</span>
                <span className="text-muted-foreground">{c.dial}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {errors.country && (
          <p className="text-sm text-destructive">{errors.country.message}</p>
        )}
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <Label htmlFor="dateOfBirth">Date of birth</Label>
        <div className="relative">
          <Calendar className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
          <Input
            id="dateOfBirth"
            type="date"
            dir="ltr"
            autoComplete="bday"
            aria-invalid={!!errors.dateOfBirth}
            className="h-12 ps-9"
            {...register("dateOfBirth")}
          />
        </div>
        {errors.dateOfBirth && (
          <p className="text-sm text-destructive">
            {errors.dateOfBirth.message}
          </p>
        )}
      </div>

      <div className="mb-5 flex flex-col gap-2">
        <Label htmlFor="password">Create password</Label>
        <div className="relative">
          <Lock className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            dir="ltr"
            autoComplete="new-password"
            placeholder="Create a password"
            aria-invalid={!!errors.password}
            className="h-12 px-9"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 end-3 my-auto text-muted-foreground"
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

      <Button
        type="submit"
        disabled={profileMut.isPending}
        className="h-12 w-full text-white"
        style={{ backgroundImage: "var(--grad)" }}
      >
        {profileMut.isPending ? (
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
