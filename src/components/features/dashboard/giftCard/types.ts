export type GiftCardStatus = "success" | "pending" | "failed";

export type GiftCard = {
  id: string;
  name: string;
  receiverEmail: string;
  receiverPhone: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  exchangeRate: string;
  payableUnit: number;
  totalCharge: number;
  payableAmount: number;
  currency: string;
  status: GiftCardStatus;
};

// TODO: replace with data from the gift-card API.
export const SEED_GIFT_CARDS: GiftCard[] = [
  {
    id: "GC57279383",
    name: "Free Fire 100 + 10 Diamond AF",
    receiverEmail: "user@appdevs.net",
    receiverPhone: "+931676446077",
    unitPrice: 1,
    quantity: 1,
    totalPrice: 1,
    exchangeRate: "1.00 USD = 1.0000 USD",
    payableUnit: 1,
    totalCharge: 1.01,
    payableAmount: 2.01,
    currency: "USD",
    status: "success",
  },
];
