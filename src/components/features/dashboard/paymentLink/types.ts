export type PaymentLinkStatus = "active" | "inactive";
export type PaymentLinkType = "product" | "customer" | "fixed";

export type PaymentLink = {
  id: string;
  title: string;
  type: PaymentLinkType;
  amount: number;
  /** Quantity shown in parens next to the amount. */
  qty: number;
  currency: string;
  status: PaymentLinkStatus;
  /** ISO timestamp. */
  createdAt: string;
  /** Shareable checkout URL. */
  url: string;
};

// TODO: replace with data from the payment-links API.
export const SEED_PAYMENT_LINKS: PaymentLink[] = [
  {
    id: "pl_1",
    title: "Hello",
    type: "product",
    amount: 100,
    qty: 1,
    currency: "USD",
    status: "active",
    createdAt: "2026-06-04T12:49:10",
    url: "https://qrpay.pro/pay/hello",
  },
];
