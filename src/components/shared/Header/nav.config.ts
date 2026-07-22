import type { LucideIcon } from "lucide-react";

export type NavLink = { labelKey: string; href: string; icon: LucideIcon };
export type NavGroup = { headingKey: string; links: NavLink[] };

export type NavSide = {
  kickKey: string;
  titleKey: string;
  descKey: string;
  href: string;
};

export type NavItem =
  | { kind: "link"; labelKey: string; href: string }
  | {
      kind: "mega";
      labelKey: string;
      leadKey: string;
      leadHref: string;
      groups: NavGroup[];
      side?: NavSide;
    };

/** Single source of truth for header navigation. Labels are i18n keys
 * resolved under the `home` namespace. */
export const NAV: NavItem[] = [
  { kind: "link", labelKey: "nav.home", href: "/" },
  { kind: "link", labelKey: "nav.about", href: "/about-us" },
  { kind: "link", labelKey: "nav.plan", href: "/pricing" },
  { kind: "link", labelKey: "nav.announcement", href: "/announcement" },
  { kind: "link", labelKey: "nav.contact", href: "/contact" },
];
