"use client";

import { useState } from "react";
import { HelpCircle, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

import { Brand } from "@/components/shared/Brand";
import { Link } from "@/i18n/navigation";
import { SidebarNavItem } from "@/components/shared/sidebar-nav-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { navByRole } from "@/lib/dashboard/nav";
import { useLogout } from "@/hooks/user/useLogout";
import { useAuthStore } from "@/store/authStore";

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const role = useAuthStore((s) => s.role);
  const { logout, isPending } = useLogout();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const groups = navByRole(role);
  const supportHref = "/user/dashboard/support-ticket";

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="mb-6 flex items-center justify-between px-1 pt-1">
        <Brand height={26} />
      </div>

      <ScrollArea className="-mx-2 min-h-0 flex-1 px-2">
        <nav className="flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group.labelKey} className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(`nav.${group.labelKey}`)}
              </p>
              {group.items.map((item) => (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  onNavigate={onNavigate}
                />
              ))}
              
            </div>
          ))}
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4.5 shrink-0" />
            {t("signOut")}
          </button>
        </nav>
      </ScrollArea>

      <div className="flex flex-col gap-3 bg-muted-foreground/5 p-4 rounded-xl">
        <div className="flex items-center gap-3">

          <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <HelpCircle className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold">{t("helpCenter.title")}</p>
          <p className="text-xs text-muted-foreground">{t("helpCenter.subtitle")}</p>
        </div>
        </div>
        <Link
          href={supportHref}
          onClick={onNavigate}
          className="mt-1 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:shadow-md hover:shadow-primary/30 hover:brightness-105 [background:var(--gradient)]"
        >
          {t("helpCenter.getSupport")}
        </Link>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("signOutConfirmTitle")}
        description={t("signOutConfirmDesc")}
        confirmLabel={t("signOut")}
        cancelLabel={tc("cancel")}
        destructive
        loading={isPending}
        onConfirm={() => {
          onNavigate?.();
          void logout();
        }}
      />
    </div>
  );
}
