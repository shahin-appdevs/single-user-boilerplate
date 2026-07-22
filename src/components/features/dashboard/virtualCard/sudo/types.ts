export type VCard = {
  id: string;
  /** First 4 digits shown on the card. */
  bin: string;
  last4: string;
  exp: string;
  holder: string;
  balance: number;
  currency: string;
  isDefault: boolean;
  /** Card-details modal fields. */
  account: string;
  brand: string;
  cvv: string;
  blocked: boolean;
};

export type CardTxnStatus = "success" | "pending" | "failed";

export type CardTxn = {
  id: string;
  type: string;
  amount: number;
  payable: number;
  currency: string;
  status: CardTxnStatus;
  /** Detail-modal fields. */
  trxId: string;
  exchangeRate: string;
  fees: number;
  cardMasked: string;
  balance: number;
  /** ISO timestamp. */
  createdAt: string;
};

// TODO: replace with data from the virtual-card API.
export const SEED_CARDS: VCard[] = [
  { id: "vc1", bin: "5061", last4: "5635", exp: "05 / 25", holder: "Test User", balance: 1250.5, currency: "USD", isDefault: true,  account: "6a2107a67b98d9ca84fd8304", brand: "Visa", cvv: "123", blocked: false },
  { id: "vc2", bin: "5061", last4: "8821", exp: "11 / 26", holder: "Test User", balance: 320.0,  currency: "USD", isDefault: false, account: "7b3218b78c09e0db95ge9415", brand: "Visa", cvv: "456", blocked: true  },
];

export const SEED_CARD_TXNS: CardTxn[] = [
  { id: "ct1", type: "Card Fund",   amount: 0,   payable: 2,   currency: "USD", status: "success", trxId: "CB98729774", exchangeRate: "1.00 USD = 1.0000 USD", fees: 2, cardMasked: "5061 00** **** 5635", balance: 769.6529, createdAt: "2026-06-04T12:49:10" },
  { id: "ct2", type: "Card Create", amount: 5,   payable: 5,   currency: "USD", status: "success", trxId: "CB98729001", exchangeRate: "1.00 USD = 1.0000 USD", fees: 0, cardMasked: "5061 00** **** 5635", balance: 774.6529, createdAt: "2026-06-03T09:12:00" },
  { id: "ct3", type: "Card Fund",   amount: 200, payable: 201, currency: "USD", status: "pending", trxId: "CB98729220", exchangeRate: "1.00 USD = 1.0000 USD", fees: 1, cardMasked: "5061 00** **** 5635", balance: 974.6529, createdAt: "2026-06-02T18:05:30" },
];
