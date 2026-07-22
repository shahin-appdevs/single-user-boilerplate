"use client";

import { CARD_PROVIDER } from "./provider";
import { ProviderUnavailable } from "./ProviderUnavailable";
import SudoCreateCard from "./sudo/CreateCard";

/** Renders the active provider's create-card form. */
export default function CreateCard() {
  if (CARD_PROVIDER === "sudo") return <SudoCreateCard />;
  return <ProviderUnavailable />;
}
