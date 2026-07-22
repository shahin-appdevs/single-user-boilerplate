/**
 * Per-role accent theme. Mirrors the auth-page accents (`ROLE_ACCENT` in
 * `components/features/auth/roleConfig`) but written as HSL triplets so the
 * dashboard tokens — consumed via `hsl(var(--token))` — resolve correctly.
 *
 * Only the accent-driving tokens are overridden; `--gradient` derives from
 * `--grad-from` / `--grad-to` in globals.css, so it updates automatically.
 */
import type { Role } from "@/types/auth";

type RoleTheme = {
  primary: string;
  gradFrom: string;
  gradTo: string;
};

// Roles whose accent differs from globals.css get an entry here. `user` is
// omitted on purpose: it mirrors the globals defaults, so overriding inline
// would clobber the light/dark-aware tokens (and flash a stale color).
const ROLE_THEME: Partial<Record<Role, RoleTheme>> = {};

const ACCENT_VARS = ["--primary", "--ring", "--grad-from", "--grad-to"] as const;

/**
 * Write the role accent onto `:root`. Roles without a theme entry clear any
 * inline overrides so globals.css (and its light/dark values) apply verbatim.
 */
export function applyRoleTheme(
  role: Role,
  target: HTMLElement = document.documentElement,
): void {
  const theme = ROLE_THEME[role];
  if (!theme) {
    for (const v of ACCENT_VARS) target.style.removeProperty(v);
    return;
  }
  target.style.setProperty("--primary", theme.primary);
  target.style.setProperty("--ring", theme.primary);
  target.style.setProperty("--grad-from", theme.gradFrom);
  target.style.setProperty("--grad-to", theme.gradTo);
}
