"use client";

import { Menu, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { NotificationsPopover } from "@/components/features/dashboard/NotificationsPopover";
import { ProfileMenu } from "@/components/features/dashboard/ProfileMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useUiStore } from "@/store/uiStore";

export function DashboardTopbar() {
  const t = useTranslations("dashboard.topbar");
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 bg-background/80 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label={t("menu")}
        onClick={toggleSidebar}
      >
        <Menu />
      </Button>

      <div className="relative hidden max-w-lg flex-1 md:block">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          className="rounded-xl border-0 bg-white ps-9 pe-14 shadow-none focus-visible:ring-0 dark:bg-muted/40"
          placeholder={t("search")}
          aria-label={t("search")}
        />
        <kbd className="pointer-events-none absolute end-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
          ⌘K
        </kbd>
      </div>

      <div className="ms-auto flex items-center gap-2">
        <LocaleSwitcher className="rounded-full bg-white shadow-xs hover:bg-muted dark:bg-muted/40" />
        <ThemeToggle className="rounded-xl bg-white shadow-xs hover:bg-muted dark:bg-muted/40" />

        <NotificationsPopover className="rounded-xl bg-white shadow-xs hover:bg-muted dark:bg-muted/40" />

        <ProfileMenu />
      </div>
    </header>
  );
}
