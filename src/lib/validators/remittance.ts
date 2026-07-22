import { z } from "zod";

type RemittanceMessageKey =
  | "fromRequired"
  | "toRequired"
  | "typeRequired"
  | "recipientRequired"
  | "amountInvalid"
  | "amountPositive";

type Translate = (key: RemittanceMessageKey) => string;

/** Build the schema with localized messages from a next-intl translator. */
export function createRemittanceSchema(t: Translate) {
  return z
    .object({
      fromCode: z.string().min(1, t("fromRequired")),
      toCode: z.string().min(1, t("toRequired")),
      transactionType: z.string().min(1, t("typeRequired")),
      recipient: z.string().trim().min(1, t("recipientRequired")),
      amount: z.coerce
        .number({ error: t("amountInvalid") })
        .positive(t("amountPositive")),
    });
}

export type RemittanceFormValues = z.input<ReturnType<typeof createRemittanceSchema>>;
