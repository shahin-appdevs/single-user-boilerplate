export type TradeStatus = "pending" | "active" | "completed" | "cancelled";

export type Trade = {
  id: string;
  sellAmount: number;
  sellCurrency: string;
  askAmount: number;
  askCurrency: string;
  /** Pre-formatted "1 GBP = 1.2000 USD". */
  rate: string;
  status: TradeStatus;
  /** ISO timestamp. */
  createdAt: string;
};

// TODO: replace with data from the P2P trade API.
export const SEED_MARKETPLACE: Trade[] = [
  { id: "MT67376812", sellAmount: 100, sellCurrency: "GBP", askAmount: 120, askCurrency: "USD", rate: "1 GBP = 1.2000 USD", status: "pending", createdAt: "2026-06-04T12:49:10" },
  { id: "MT67376820", sellAmount: 500, sellCurrency: "USD", askAmount: 470, askCurrency: "EUR", rate: "1 USD = 0.9400 EUR", status: "active",  createdAt: "2026-06-03T09:12:00" },
];

export const SEED_OFFERS: Trade[] = [
  { id: "MT67377001", sellAmount: 250, sellCurrency: "USD", askAmount: 197, askCurrency: "GBP", rate: "1 USD = 0.7900 GBP", status: "pending", createdAt: "2026-06-04T15:20:00" },
];

export const SEED_MY_TRADES: Trade[] = [
  { id: "MT67376812", sellAmount: 100, sellCurrency: "GBP", askAmount: 120, askCurrency: "USD", rate: "1 GBP = 1.2000 USD", status: "pending",   createdAt: "2026-06-04T12:49:10" },
  { id: "MT67370055", sellAmount: 80,  sellCurrency: "EUR", askAmount: 85,  askCurrency: "USD", rate: "1 EUR = 1.0600 USD", status: "completed", createdAt: "2026-05-28T18:05:30" },
];
