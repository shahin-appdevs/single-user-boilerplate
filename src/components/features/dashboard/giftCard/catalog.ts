export type CatalogBrand = "netflix" | "amazon" | "google" | "apple";

export type CatalogCard = {
  id: string;
  name: string;
  brand: CatalogBrand;
  currency: string;
  /** Available face values in the card currency. */
  denominations: number[];
};

/** Brand visual presets (full-image stand-ins until real artwork lands). */
export const BRAND_STYLE: Record<CatalogBrand, { bg: string; logo: string; logoClass: string }> = {
  netflix: { bg: "bg-black",                           logo: "NETFLIX",     logoClass: "text-red-600" },
  amazon:  { bg: "bg-zinc-900",                        logo: "amazon",      logoClass: "text-white lowercase" },
  google:  { bg: "bg-white",                           logo: "Google Play", logoClass: "text-zinc-700" },
  apple:   { bg: "bg-gradient-to-br from-sky-400 to-blue-600", logo: "App Store", logoClass: "text-white" },
};

// TODO: replace with data from the gift-card catalog API.
export const CATALOG_CARDS: CatalogCard[] = [
  { id: "g1",  name: "Netflix Spain",             brand: "netflix", currency: "EUR", denominations: [25, 50, 100] },
  { id: "g2",  name: "Netflix Poland",            brand: "netflix", currency: "PLN", denominations: [60, 80, 120] },
  { id: "g3",  name: "Google Play BR",            brand: "google",  currency: "BRL", denominations: [30, 60, 100] },
  { id: "g4",  name: "Netflix US",                brand: "netflix", currency: "USD", denominations: [25, 50, 100] },
  { id: "g5",  name: "App Store & iTunes Germany", brand: "apple",  currency: "EUR", denominations: [15, 25, 50]  },
  { id: "g6",  name: "App Store & iTunes UK",     brand: "apple",   currency: "GBP", denominations: [15, 25, 50]  },
  { id: "g7",  name: "Netflix Greece",            brand: "netflix", currency: "EUR", denominations: [25, 50, 100] },
  { id: "g8",  name: "Amazon AT",                 brand: "amazon",  currency: "EUR", denominations: [25, 50, 100] },
  { id: "g9",  name: "Amazon France",             brand: "amazon",  currency: "EUR", denominations: [25, 50, 100] },
  { id: "g10", name: "Amazon Spain",              brand: "amazon",  currency: "EUR", denominations: [25, 50, 100] },
  { id: "g11", name: "App Store & iTunes France", brand: "apple",   currency: "EUR", denominations: [15, 25, 50]  },
  { id: "g12", name: "Netflix UAE",               brand: "netflix", currency: "AED", denominations: [50, 100, 200] },
  { id: "g13", name: "Amazon DE",                 brand: "amazon",  currency: "EUR", denominations: [25, 50, 100] },
  { id: "g14", name: "Amazon Italy",              brand: "amazon",  currency: "EUR", denominations: [25, 50, 100] },
  { id: "g15", name: "Amazon UK",                 brand: "amazon",  currency: "GBP", denominations: [25, 50, 100] },
  { id: "g16", name: "Amazon NL",                 brand: "amazon",  currency: "EUR", denominations: [25, 50, 100] },
  { id: "g17", name: "Netflix BR",                brand: "netflix", currency: "BRL", denominations: [30, 60, 100] },
  { id: "g18", name: "Netflix Germany",           brand: "netflix", currency: "EUR", denominations: [25, 50, 100] },
];
