// Phone country list. `national` validates the local number (no dial code).
// Add rows as markets open.

export type Country = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string; // E.164 dial code incl. "+"
  flag: string; // emoji
  national: RegExp; // local number, digits only
  example: string;
};

export const COUNTRIES: readonly Country[] = [
  {
    code: "BD",
    name: "Bangladesh",
    dial: "+880",
    flag: "🇧🇩",
    national: /^1[3-9]\d{8}$/,
    example: "1712 345678",
  },
  {
    code: "NG",
    name: "Nigeria",
    dial: "+234",
    flag: "🇳🇬",
    national: /^[789]\d{9}$/,
    example: "803 000 0000",
  },
  {
    code: "GH",
    name: "Ghana",
    dial: "+233",
    flag: "🇬🇭",
    national: /^[235]\d{8}$/,
    example: "24 123 4567",
  },
  {
    code: "KE",
    name: "Kenya",
    dial: "+254",
    flag: "🇰🇪",
    national: /^[71]\d{8}$/,
    example: "712 345678",
  },
] as const;

export const DEFAULT_COUNTRY = COUNTRIES[0];

export const findCountry = (code: string): Country =>
  COUNTRIES.find((c) => c.code === code) ?? DEFAULT_COUNTRY;
