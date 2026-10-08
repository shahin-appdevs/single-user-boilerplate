import type { CSSProperties } from "react";
import {
  Clock,
  Layers,
  ShieldCheck,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { Role } from "@/types/auth";

// Role accent scoped to the auth subtree via CSS custom properties.
// QRSim green — matches the landing palette and the Auth design.
export const ROLE_ACCENT: Record<Role, CSSProperties> = {
  user: {
    "--grad-from": "hsl(164 82% 53%)",
    "--grad-to": "hsl(187 66% 42%)",
    "--primary": "hsl(164 82% 53%)",
    "--grad": "linear-gradient(115deg, hsl(164 82% 53%), hsl(187 66% 42%))",
  } as CSSProperties,
};

export type RoleMeta = {
  label: string;
  kicker: string;
  eyebrow: string;
  icon: LucideIcon;
  headline: string;
  /** Emphasised word inside the headline, rendered in italic accent. */
  headlineAccent: string;
  lead: string;
  features: { icon: LucideIcon; text: string }[];
};

export const ROLE_META: Record<Role, RoleMeta> = {
  user: {
    label: "User",
    kicker: "User account",
    eyebrow: "QRSim · User",
    icon: Wallet,
    headline: "One wallet. Every strategy — compounding.",
    headlineAccent: "strategy",
    lead: "Log in to deploy capital across 14 chains with the security of MPC custody and the transparency of on-chain proofs.",
    features: [
      { icon: ShieldCheck, text: "MPC · SOC 2" },
      { icon: TrendingUp, text: "11.8% avg APY" },
      { icon: Clock, text: "8-sec withdrawals" },
      { icon: Layers, text: "14 chains" },
    ],
  },
};

export const ROLES: Role[] = ["user"];
