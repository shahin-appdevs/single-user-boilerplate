import { z } from "zod";

type PayLinkMessageKey =
  | "titleRequired"
  | "currencyRequired"
  | "amountPositive"
  | "minMax";

type Translate = (key: PayLinkMessageKey) => string;

/** Payment-link builder schema. `fixed` toggles fixed-amount vs customer-chosen. */
export function createPayLinkSchema(t: Translate) {
  return z
    .object({
      type: z.enum(["customer", "fixed"]),
      title: z.string().min(1, t("titleRequired")),
      description: z.string().optional(),
      currency: z.string().min(1, t("currencyRequired")),
      setLimits: z.boolean(),
      minAmount: z.string().optional(),
      maxAmount: z.string().optional(),
      fixedAmount: z.string().optional(),
    })
    .refine(
      (d) => d.type !== "fixed" || Number(d.fixedAmount) > 0,
      { message: t("amountPositive"), path: ["fixedAmount"] },
    )
    .refine(
      (d) =>
        !(d.type === "customer" && d.setLimits) ||
        !d.minAmount ||
        !d.maxAmount ||
        Number(d.maxAmount) >= Number(d.minAmount),
      { message: t("minMax"), path: ["maxAmount"] },
    );
}

export type PayLinkFormValues = z.infer<ReturnType<typeof createPayLinkSchema>>;
