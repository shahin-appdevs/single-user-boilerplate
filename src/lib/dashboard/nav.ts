import {
  ArrowLeftRight,
  ArrowUpRight,
  BadgeDollarSign,
  Bell,
  Contact,
  CreditCard,
  Gift,
  Globe,
  Handshake,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  Link2,
  MessagesSquare,
  QrCode,
  Receipt,
  ReceiptText,
  Send,
  ShieldCheck,
  Smartphone,
  Store,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { Role } from "@/types/auth";

/** Keys that exist under the `dashboard.nav` message namespace. */
export type DashboardNavKey =
  | "main"
  | "money"
  | "cards"
  | "services"
  | "billPay"
  | "mobileTopUp"
  | "p2pTrade"
  | "myChat"
  | "giftCard"
  | "security"
  | "twoFactorAuth"
  | "setupPin"
  | "account"
  | "dashboard"
  | "wallet"
  | "send"
  | "receive"
  | "payAndWithdraw"
  | "paymentLink"
  | "statement"
  | "card"
  | "addMoney"
  | "sendMoneyIn"
  | "exchange"
  | "remittance"
  | "referral"
  | "recipients"
  | "profitLogs"
  | "withdraw"
  | "transactions"
  | "apiKey"
  | "gatewaySettings"
  | "savedSender"
  | "savedReceiver"
  | "profile"
  | "notifications"
  | "supportTickets"
  | "more";

export type NavItem = {
  /** Locale-less path (next-intl Link adds the prefix). */
  href: string;
  icon: LucideIcon;
  labelKey: DashboardNavKey;
  /** When true, only exact pathname match marks this item active. */
  exact?: boolean;
  /** When set, the nav row shows an unread badge sourced later. */
  badgeKey?: "notifications";
};

export type NavGroup = {
  labelKey: DashboardNavKey;
  items: NavItem[];
};

/** Base segment per role. */
export const roleBase: Record<Role, string> = {
  user: "/user",
};

export const roleHome = (role: Role): string => `${roleBase[role]}/dashboard/overview`;

/* ─── Personal (user) ─────────────────────────────────────────────────────── */

const personalNav: NavGroup[] = [
  {
    labelKey: "main",
    items: [
      { href: "/user/overview",  icon: LayoutDashboard, labelKey: "dashboard" },
    ],
  },
  {
    labelKey: "money",
    items: [
      { href: "/user/money-transfer",   icon: Send,            labelKey: "send"          },
      { href: "/user/receive",        icon: QrCode,          labelKey: "receive"       },
      { href: "/user/add-money",      icon: BadgeDollarSign, labelKey: "addMoney"      },
      { href: "/user/withdraw-money", icon: ArrowUpRight,    labelKey: "withdraw"      },
      { href: "/user/money-exchange", icon: ArrowLeftRight,  labelKey: "exchange"       },
      { href: "/user/pay-out",        icon: Store,           labelKey: "payAndWithdraw" },
      { href: "/user/payment-link",   icon: Link2,           labelKey: "paymentLink"    },
      { href: "/user/statement",      icon: Receipt,         labelKey: "statement"     },
    ],
  },
  {
    labelKey: "cards",
    items: [
      { href: "/user/card",           icon: CreditCard,      labelKey: "card"          },
      { href: "/user/gift-card",      icon: Gift,            labelKey: "giftCard"       },
    ],
  },
  {
    labelKey: "services",
    items: [
      { href: "/user/bill-pay",       icon: ReceiptText,     labelKey: "billPay"        },
      { href: "/user/mobile-topup",   icon: Smartphone,      labelKey: "mobileTopUp"    },
      { href: "/user/p2p-trade",      icon: Handshake,       labelKey: "p2pTrade"       },
      { href: "/user/my-chat",        icon: MessagesSquare,  labelKey: "myChat"         },
      { href: "/user/remittance",     icon: Globe,           labelKey: "remittance"     },
    ],
  },
  {
    labelKey: "security",
    items: [
      { href: "/user/two-factor-auth", icon: ShieldCheck, labelKey: "twoFactorAuth" },
      { href: "/user/setup-pin",       icon: KeyRound,    labelKey: "setupPin" },
    ],
  },
  {
    labelKey: "account",
    items: [
      { href: "/user/recipients", icon: Contact, labelKey: "recipients" },
      { href: "/user/referral", icon: Users, labelKey: "referral" },
      { href: "/user/profile", icon: User, labelKey: "profile" },
      { href: "/user/support-ticket", icon: LifeBuoy, labelKey: "supportTickets" },
      {
        href: "/user/notifications",
        icon: Bell,
        labelKey: "notifications",
        badgeKey: "notifications",
      },
    ],
  },
];

const NAV_BY_ROLE: Record<Role, NavGroup[]> = {
  user: personalNav,
};

/** Sidebar nav groups for a role. */
export const navByRole = (role: Role): NavGroup[] => NAV_BY_ROLE[role] ?? personalNav;

/* ─── Mobile bottom-nav (primary tabs + More) ─────────────────────────────── */

const personalBottomNav: NavItem[] = [
  { href: "/user/overview",     icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/user/money-transfer", icon: Send,            labelKey: "send"      },
  { href: "/user/statement",    icon: Receipt,         labelKey: "statement" },
];

const BOTTOM_NAV_BY_ROLE: Record<Role, NavItem[]> = {
  user: personalBottomNav,
};

/** Primary bottom-nav tabs for a role (4 items + More). */
export const bottomNavByRole = (role: Role): NavItem[] =>
  BOTTOM_NAV_BY_ROLE[role] ?? personalBottomNav;

/** Items shown in the "More" bottom sheet = every nav item not already a primary tab. */
export const moreNavByRole = (role: Role): NavItem[] => {
  const primary = new Set(bottomNavByRole(role).map((i) => i.href));
  return navByRole(role)
    .flatMap((group) => group.items)
    .filter((item) => !primary.has(item.href));
};

export const moreNavKey: DashboardNavKey = "more";
export const moreNavIcon = LayoutGrid;
