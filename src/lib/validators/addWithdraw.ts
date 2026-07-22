import { z } from "zod";

type AddMessageKey = "gatewayRequired" | "amountInvalid" | "amountPositive";

type WithdrawMessageKey =
  | "methodRequired"
  | "amountInvalid"
  | "amountPositive"
  | "accountNameRequired"
  | "accountNumberRequired";

type AddTranslate = (key: AddMessageKey) => string;
type WithdrawTranslate = (key: WithdrawMessageKey) => string;

export function createAddSchema(t: AddTranslate) {
  return z.object({
    gateway: z.string().min(1, t("gatewayRequired")),
    amount: z.coerce
      .number({ error: t("amountInvalid") })
      .positive(t("amountPositive")),
  });
}

export function createWithdrawSchema(t: WithdrawTranslate) {
  return z.object({
    method: z.string().min(1, t("methodRequired")),
    amount: z.coerce
      .number({ error: t("amountInvalid") })
      .positive(t("amountPositive")),
    accountName: z.string().trim().min(1, t("accountNameRequired")),
    accountNumber: z.string().trim().min(1, t("accountNumberRequired")),
  });
}

export type AddFormValues = z.input<ReturnType<typeof createAddSchema>>;
export type WithdrawFormValues = z.input<ReturnType<typeof createWithdrawSchema>>;
