import { z } from "zod";

type CustomerMessageKey =
  | "firstName"
  | "lastName"
  | "dob"
  | "identityType"
  | "identityNumber"
  | "phone"
  | "address1"
  | "city"
  | "state"
  | "country"
  | "postalCode";

type Translate = (key: CustomerMessageKey) => string;

/** Create-customer schema for the virtual-card KYC form (text fields). */
export function createCustomerSchema(t: Translate) {
  return z.object({
    firstName: z.string().min(1, t("firstName")),
    lastName: z.string().min(1, t("lastName")),
    dob: z.string().min(1, t("dob")),
    identityType: z.string().min(1, t("identityType")),
    identityNumber: z.string().min(1, t("identityNumber")),
    phone: z.string().min(1, t("phone")),
    address1: z.string().min(1, t("address1")),
    address2: z.string().optional(),
    city: z.string().min(1, t("city")),
    state: z.string().min(1, t("state")),
    country: z.string().min(1, t("country")),
    postalCode: z.string().min(1, t("postalCode")),
  });
}

export type CustomerFormValues = z.input<ReturnType<typeof createCustomerSchema>>;
