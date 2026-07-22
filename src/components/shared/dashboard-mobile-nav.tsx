"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { bottomNavByRole, moreNavByRole, moreNavIcon, moreNavKey } from "@/lib/dashboard/nav";
import { SidebarNavItem } from "@/components/shared/sidebar-nav-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { getInitials } from "@/lib/dashboard/initials";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/user/useLogout";

const MoreIcon = moreNavIcon;

export function DashboardMobileNav() {
  const t = useTranslations("dashboard.nav");
  const tDash = useTranslations("dashboard");
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.role);
  const { logout, isPending } = useLogout();

  const bottomItems = bottomNavByRole(role);
  const moreItems = moreNavByRole(role);

  // "More" is active when current path matches any more-item
  const moreActive = moreItems.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <>
      <nav
        aria-label={t("main")}
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-background/90 backdrop-blur lg:hidden"
      >
        {/* Primary 4 tabs */}
        {bottomItems.map((item) => {
          const active =
            pathname === item.href ||
            (!item.exact && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="w-full truncate text-center">{t(item.labelKey)}</span>
            </Link>
          );
        })}

        {/* More tab */}
        <button
          aria-label={t(moreNavKey)}
          onClick={() => setMoreOpen(true)}
          className={cn(
            "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
            moreActive ? "text-primary" : "text-muted-foreground",
          )}
        >
          <MoreIcon className="size-5" />
          <span className="w-full truncate text-center">{t(moreNavKey)}</span>
        </button>
      </nav>

      {/* More bottom sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          aria-describedby={undefined}
          className="rounded-t-2xl px-4 pb-8 pt-5 lg:hidden"
        >
          <SheetTitle className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {t(moreNavKey)}
          </SheetTitle>

          {/* Nav items */}
          <nav className="flex flex-col gap-1">
            {moreItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                onNavigate={() => setMoreOpen(false)}
              />
            ))}
          </nav>

          {/* User footer */}
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border p-3">
            <Avatar className="size-9">
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name ?? "—"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {tDash(`roles.${role}`)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={tDash("signOut")}
              disabled={isPending}
              onClick={() => { void logout(); setMoreOpen(false); }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
