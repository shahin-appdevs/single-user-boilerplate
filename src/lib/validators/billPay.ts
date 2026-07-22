import { z } from "zod";

type BillPayMessageKey =
  | "billTypeRequired"
  | "billMonthRequired"
  | "billNumberRequired"
  | "amountInvalid"
  | "amountPositive"
  | "selectCurrency";

type Translate = (key: BillPayMessageKey) => string;

/** Bill Pay schema — pays a utility bill from a wallet, converted to the biller currency. */
export function createBillPaySchema(t: Translate) {
  return z.object({
    billType: z.string().min(1, t("billTypeRequired")),
    billMonth: z.string().min(1, t("billMonthRequired")),
    billNumber: z.string().min(1, t("billNumberRequired")),
    amount: z.coerce
      .number({ error: t("amountInvalid") })
      .positive(t("amountPositive")),
    payCode: z.string().min(1, t("selectCurrency")),
  });
}

export type BillPayFormValues = z.input<ReturnType<typeof createBillPaySchema>>;
