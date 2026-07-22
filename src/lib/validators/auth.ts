import { z } from "zod";

import { findCountry } from "@/constants/countries";

// Messages are neutral English; translation keys come later.

export const roleSchema = z.enum(["user"]);

export const emailSchema = z.string().trim().email("Enter a valid email address");

export const pinSchema = z
  .string()
  .length(6, "PIN must be 6 digits")
  .regex(/^\d{6}$/, "PIN must be 6 digits");

export const passwordSchema = z
  .string()
  .min(1, "Enter your password")
  .min(8, "Password must be at least 8 characters");

export const otpSchema = z
  .string()
  .length(6, "Enter the 6-digit code")
  .regex(/^\d{6}$/, "Enter the 6-digit code");

export const nameSchema = z
  .string()
  .trim()
  .min(3, "Enter your full name")
  .max(60, "Name is too long");

// National number validated against the selected country's pattern.
const phoneValid = (country: string, phone: string): boolean =>
  findCountry(country).national.test(phone.replace(/\D/g, ""));

// Step 0 of registration: identifier only (phone OR email) + terms.
export const identifierStepSchema = z
  .discriminatedUnion("method", [
    z.object({
      method: z.literal("phone"),
      country: z.string().min(2),
      phone: z.string().min(1, "Enter your phone number"),
      acceptTerms: z.literal(true, { message: "Accept the terms to continue" }),
    }),
    z.object({
      method: z.literal("email"),
      email: emailSchema,
      acceptTerms: z.literal(true, { message: "Accept the terms to continue" }),
    }),
  ])
  .superRefine((val, ctx) => {
    if (val.method === "phone" && !phoneValid(val.country, val.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number",
      });
    }
  });

// Must be a real past date and at least 18 years old.
const isAdult = (value: string): boolean => {
  const dob = new Date(value);
  if (Number.isNaN(dob.getTime())) return false;
  const now = new Date();
  const age =
    now.getFullYear() -
    dob.getFullYear() -
    (now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())
      ? 1
      : 0);
  return age >= 18 && age <= 120;
};

// Step 2 of registration: profile details + password.
export const detailsStepSchema = z.object({
  fullName: nameSchema,
  country: z.string().min(2, "Select your country"),
  dateOfBirth: z
    .string()
    .min(1, "Enter your date of birth")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date")
    .refine(isAdult, "You must be at least 18 years old"),
  password: passwordSchema,
});

export const loginSchema = z
  .discriminatedUnion("method", [
    z.object({
      method: z.literal("email"),
      role: roleSchema,
      email: emailSchema,
      // pin: pinSchema, // kept for future PIN-based login
      password: passwordSchema,
      remember: z.boolean(),
    }),
    z.object({
      method: z.literal("phone"),
      role: roleSchema,
      country: z.string().min(2),
      phone: z.string().min(1, "Enter your phone number"),
      // pin: pinSchema, // kept for future PIN-based login
      password: passwordSchema,
      remember: z.boolean(),
    }),
  ])
  .superRefine((val, ctx) => {
    if (val.method === "phone" && !phoneValid(val.country, val.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number",
      });
    }
  });

export const otpStepSchema = z.object({ code: otpSchema });

// Forgot-password step 0: identifier only (phone OR email).
export const forgotIdentifierSchema = z
  .discriminatedUnion("method", [
    z.object({
      method: z.literal("email"),
      role: roleSchema,
      email: emailSchema,
    }),
    z.object({
      method: z.literal("phone"),
      role: roleSchema,
      country: z.string().min(2),
      phone: z.string().min(1, "Enter your phone number"),
    }),
  ])
  .superRefine((val, ctx) => {
    if (val.method === "phone" && !phoneValid(val.country, val.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Enter a valid phone number",
      });
    }
  });

// Forgot-password step 1: verification code + new password.
export const resetPasswordSchema = z
  .object({
    code: otpSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const pinStepSchema = z
  .object({ pin: pinSchema, confirmPin: pinSchema })
  .refine((d) => d.pin === d.confirmPin, {
    path: ["confirmPin"],
    message: "PINs do not match",
  });

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];

export const kycFileSchema = z
  .instanceof(File, { message: "Upload a file" })
  .refine((f) => f.size <= MAX_FILE_BYTES, "File must be 5 MB or smaller")
  .refine(
    (f) => ACCEPTED_TYPES.includes(f.type),
    "Use a JPG, PNG, or PDF file",
  );

export const kycStepSchema = z.object({
  nidFront: kycFileSchema,
  nidBack: kycFileSchema,
  selfie: kycFileSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type IdentifierValues = z.infer<typeof identifierStepSchema>;
export type DetailsValues = z.infer<typeof detailsStepSchema>;
export type OtpValues = z.infer<typeof otpStepSchema>;
export type ForgotIdentifierValues = z.infer<typeof forgotIdentifierSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type PinValues = z.infer<typeof pinStepSchema>;
export type KycValues = z.infer<typeof kycStepSchema>;

export { ACCEPTED_TYPES, MAX_FILE_BYTES };
