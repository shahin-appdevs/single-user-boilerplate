"use client";

import { useLocale } from "next-intl";

import { DashboardMobileNav } from "@/components/shared/dashboard-mobile-nav";
import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { DashboardTopbar } from "@/components/shared/DashboardTopbar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { isRtl, type Locale } from "@/i18n/routing";
import { useUiStore } from "@/store/uiStore";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale;
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);

  // Drawer enters from the inline-start edge (right in RTL).
  const drawerSide = isRtl(locale) ? "right" : "left";

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop sidebar — lg+ only */}
      <aside className="sticky top-0 hidden h-screen w-[268px] shrink-0 bg-card lg:block">
        <DashboardSidebar />
      </aside>

      {/* Mobile/tablet drawer — below lg */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side={drawerSide}
          aria-describedby={undefined}
          className="w-[280px] p-0 lg:hidden"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 pb-20 lg:pb-0">{children}</main>
        <DashboardMobileNav />
      </div>
    </div>
  );
}
