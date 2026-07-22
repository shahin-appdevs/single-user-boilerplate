"use client";

import { CARD_PROVIDER } from "./provider";
import { ProviderUnavailable } from "./ProviderUnavailable";
import SudoCreateCustomer from "./sudo/CreateCustomer";

/** Renders the active provider's create-customer form. */
export default function CreateCustomer() {
  if (CARD_PROVIDER === "sudo") return <SudoCreateCustomer />;
  return <ProviderUnavailable />;
}
