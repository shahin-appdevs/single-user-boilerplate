"use client";

import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AuthAside } from "./AuthAside";
import { ROLE_ACCENT } from "./roleConfig";

// Two-column auth layout. Role accent applied as scoped CSS vars on the root,
// so every child can read var(--grad) / var(--primary).
export function AuthShell({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.role);

  return (
    <div
      data-role={role}
      style={ROLE_ACCENT[role]}
      className="grid min-h-dvh grid-cols-1 min-[880px]:grid-cols-[1.05fr_1fr]"
    >
      <AuthAside />

      <main className="flex max-h-dvh flex-col overflow-y-auto px-6 py-7 sm:px-12">
        <div className="flex items-center gap-3">
          {/* Brand only shows on mobile (desktop shows it in the left aside). */}
          <span className="font-hero text-lg font-bold tracking-tight min-[880px]:hidden">
            Cryp<span style={{ color: "var(--primary)" }}>Invest</span>
          </span>
          <div className="ml-auto flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-9 animate-[fade-in-up_0.7s_cubic-bezier(.2,.7,.2,1)_0.15s_both]">
          {children}
        </div>

        <p className="text-center text-[12px] text-muted-foreground">
          Protected by MPC custody · SOC 2 Type II ·{" "}
          <Link href="/privacy-policy" style={{ color: "var(--primary)" }}>
            Privacy
          </Link>
        </p>
      </main>
    </div>
  );
}
