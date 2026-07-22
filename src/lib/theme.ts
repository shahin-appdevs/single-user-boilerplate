/**
 * Framework-agnostic theme utilities.
 *
 * CSS color variables are stored as space-separated HSL triplets
 * (e.g. "222 47% 11%") so the backend can override them at runtime by
 * writing inline `--token` properties on :root. The `@theme` block in
 * globals.css wraps each token with `hsl(var(--token))`.
 */

export type HslTriplet = string;

export type TokenName =
  | "background"
  | "foreground"
  | "card"
  | "card-foreground"
  | "popover"
  | "popover-foreground"
  | "primary"
  | "primary-foreground"
  | "secondary"
  | "secondary-foreground"
  | "muted"
  | "muted-foreground"
  | "accent"
  | "accent-foreground"
  | "destructive"
  | "destructive-foreground"
  | "border"
  | "input"
  | "ring";

export type BackendThemeColors = Partial<Record<TokenName, string>>;

const TOKEN_NAMES: readonly TokenName[] = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
];

const TOKEN_SET = new Set<string>(TOKEN_NAMES);

const HSL_TRIPLET_RE = /^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/;
const HEX_RE = /^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const isDev = process.env.NODE_ENV !== "production";

/** Convert `#rgb` / `#rrggbb` (optional `#`, case-insensitive) to an `H S% L%` triplet. */
export function hexToHsl(hex: string): HslTriplet {
  if (typeof hex !== "string" || !HEX_RE.test(hex.trim())) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  const l = (max + min) / 2;

  let hue = 0;
  let sat = 0;

  if (delta !== 0) {
    sat = delta / (1 - Math.abs(2 * l - 1));

    if (max === r) {
      hue = ((g - b) / delta) % 6;
    } else if (max === g) {
      hue = (b - r) / delta + 2;
    } else {
      hue = (r - g) / delta + 4;
    }

    hue *= 60;
    if (hue < 0) hue += 360;
  }

  return `${Math.round(hue)} ${Math.round(sat * 100)}% ${Math.round(l * 100)}%`;
}

/** Coerce a backend value into an HSL triplet. Accepts hex or an existing triplet. */
export function normalizeColor(value: string): HslTriplet {
  if (typeof value !== "string") {
    throw new Error(`Invalid color value: ${String(value)}`);
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("#")) {
    return hexToHsl(trimmed);
  }

  if (HSL_TRIPLET_RE.test(trimmed)) {
    return trimmed;
  }

  throw new Error(`Unsupported color format: ${value}`);
}

function isKnownToken(token: string): token is TokenName {
  return TOKEN_SET.has(token);
}

/** Apply backend colors as inline CSS variables on `target`. Unknown tokens are skipped. */
export function applyBackendTheme(
  colors: BackendThemeColors,
  target: HTMLElement = document.documentElement,
): void {
  for (const [token, value] of Object.entries(colors)) {
    if (value == null) continue;

    if (!isKnownToken(token)) {
      if (isDev) {
        console.warn(`[theme] Skipping unknown token: ${token}`);
      }
      continue;
    }

    target.style.setProperty(`--${token}`, normalizeColor(value));
  }
}

/** Remove inline backend overrides. Clears all known tokens when `tokens` is omitted. */
export function resetBackendTheme(
  tokens?: TokenName[],
  target: HTMLElement = document.documentElement,
): void {
  const list = tokens ?? TOKEN_NAMES;
  for (const token of list) {
    target.style.removeProperty(`--${token}`);
  }
}
