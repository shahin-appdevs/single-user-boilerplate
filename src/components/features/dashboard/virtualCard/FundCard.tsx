"use client";

import { CARD_PROVIDER } from "./provider";
import { ProviderUnavailable } from "./ProviderUnavailable";
import SudoFundCard from "./sudo/FundCard";

/** Renders the active provider's fund-card form. */
export default function FundCard() {
  if (CARD_PROVIDER === "sudo") return <SudoFundCard />;
  return <ProviderUnavailable />;
}
