"use client";

import { CARD_PROVIDER } from "./provider";
import { ProviderUnavailable } from "./ProviderUnavailable";
import SudoVirtualCard from "./sudo/VirtualCard";

/** Renders the active provider's virtual-card overview. */
export default function VirtualCard() {
  if (CARD_PROVIDER === "sudo") return <SudoVirtualCard />;
  return <ProviderUnavailable />;
}
