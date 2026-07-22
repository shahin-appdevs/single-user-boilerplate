import { z } from "zod";

type ExchangeMessageKey =
  | "amountInvalid"
  | "amountPositive"
  | "selectWallet"
  | "selectCurrency"
  | "differentCurrencies";

type Translate = (key: ExchangeMessageKey) => string;

/** Build the schema with localized messages from a next-intl translator. */
export function createExchangeSchema(t: Translate) {
  return z
    .object({
      amount: z.coerce
        .number({ error: t("amountInvalid") })
        .positive(t("amountPositive")),
      fromCode: z.string().min(1, t("selectWallet")),
      toCode: z.string().min(1, t("selectCurrency")),
    })
    .refine((d) => d.fromCode !== d.toCode, {
      message: t("differentCurrencies"),
      path: ["toCode"],
    });
}

export type ExchangeFormValues = z.input<ReturnType<typeof createExchangeSchema>>;
