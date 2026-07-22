import { z } from "zod";

type AutoMessageKey = "mobileRequired";
type ManualMessageKey =
  | "operatorRequired"
  | "mobileRequired"
  | "amountInvalid"
  | "amountPositive"
  | "selectCurrency";

/** Automatic top-up — operator is auto-detected, only the number is needed. */
export function createAutoTopUpSchema(t: (k: AutoMessageKey) => string) {
  return z.object({
    country: z.string().min(1),
    mobile: z.string().min(1, t("mobileRequired")),
  });
}

/** Manual top-up — pick operator + amount explicitly. */
export function createManualTopUpSchema(t: (k: ManualMessageKey) => string) {
  return z.object({
    operator: z.string().min(1, t("operatorRequired")),
    country: z.string().min(1),
    mobile: z.string().min(1, t("mobileRequired")),
    amount: z.coerce
      .number({ error: t("amountInvalid") })
      .positive(t("amountPositive")),
    payCode: z.string().min(1, t("selectCurrency")),
  });
}

export type AutoTopUpFormValues = z.input<ReturnType<typeof createAutoTopUpSchema>>;
export type ManualTopUpFormValues = z.input<ReturnType<typeof createManualTopUpSchema>>;
