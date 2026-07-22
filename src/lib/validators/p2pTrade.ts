import { z } from "zod";

type TradeMessageKey =
  | "amountInvalid"
  | "amountPositive"
  | "rateInvalid"
  | "ratePositive"
  | "selectCurrency";

type Translate = (key: TradeMessageKey) => string;

/** Create-trade schema — sell an amount in one currency, ask a rate in another. */
export function createTradeSchema(t: Translate) {
  return z.object({
    sellAmount: z.coerce
      .number({ error: t("amountInvalid") })
      .positive(t("amountPositive")),
    sellCode: z.string().min(1, t("selectCurrency")),
    askRate: z.coerce
      .number({ error: t("rateInvalid") })
      .positive(t("ratePositive")),
    askCode: z.string().min(1, t("selectCurrency")),
  });
}

export type TradeFormValues = z.input<ReturnType<typeof createTradeSchema>>;
