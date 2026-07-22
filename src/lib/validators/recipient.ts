import { z } from "zod";

type RecipientMessageKey =
  | "nameRequired"
  | "countryRequired"
  | "zipRequired"
  | "emailRequired"
  | "emailInvalid";

type Translate = (key: RecipientMessageKey) => string;

export function createRecipientSchema(t: Translate) {
  return z.object({
    name: z.string().trim().min(1, t("nameRequired")),
    country: z.string().min(1, t("countryRequired")),
    zipCode: z.string().trim().min(1, t("zipRequired")),
    email: z
      .string()
      .trim()
      .min(1, t("emailRequired"))
      .email(t("emailInvalid")),
  });
}

export type RecipientFormValues = z.input<ReturnType<typeof createRecipientSchema>>;
