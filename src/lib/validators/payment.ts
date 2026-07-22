import { z } from "zod";

type PaymentMessageKey =
  | "accountRequired"
  | "accountInvalid"
  | "amountInvalid"
  | "amountPositive"
  | "selectWallet"
  | "selectCurrency";

type Translate = (key: PaymentMessageKey) => string;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{6,15}$/;

/** Make Payment schema — pays a merchant addressed by phone/email. */
export function createPaymentSchema(t: Translate) {
  return z.object({
    account: z
      .string()
      .min(1, t("accountRequired"))
      .refine((v) => EMAIL_RE.test(v) || PHONE_RE.test(v.replace(/[\s-]/g, "")), {
        message: t("accountInvalid"),
      }),
    amount: z.coerce
      .number({ error: t("amountInvalid") })
      .positive(t("amountPositive")),
    fromCode: z.string().min(1, t("selectWallet")),
    toCode: z.string().min(1, t("selectCurrency")),
  });
}

export type PaymentFormValues = z.input<ReturnType<typeof createPaymentSchema>>;
