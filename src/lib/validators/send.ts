import { z } from "zod";

type SendMessageKey =
  | "recipientRequired"
  | "amountInvalid"
  | "amountPositive";

type Translate = (key: SendMessageKey) => string;

/** Build the schema with localized messages from a next-intl translator. */
export function createSendSchema(t: Translate) {
  return z.object({
    recipient: z.string().trim().min(1, t("recipientRequired")),
    amount: z.coerce
      .number({ error: t("amountInvalid") })
      .positive(t("amountPositive")),
  });
}

export type SendFormValues = z.input<ReturnType<typeof createSendSchema>>;
