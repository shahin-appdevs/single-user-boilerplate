"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/dashboard/nav";

type Props = {
  item: NavItem;
  /** Unread count for items with a `badgeKey`. */
  badge?: number;
  /** Called after navigating — used to close the mobile drawer. */
  onNavigate?: () => void;
};

export function SidebarNavItem({ item, badge, onNavigate }: Props) {
  const t = useTranslations("dashboard.nav");
  const pathname = usePathname();
  const active =
    pathname === item.href ||
    (!item.exact && pathname.startsWith(`${item.href}/`));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
    >
      {/* 3px gradient active bar on the inline-start edge. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1.5 start-0 w-[3px] rounded-e bg-grad transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon className="size-5 shrink-0" />
      <span className="truncate">{t(item.labelKey)}</span>
      {badge ? (
        <span className="ms-auto inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
