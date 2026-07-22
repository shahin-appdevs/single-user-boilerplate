/**
 * Minimal device handle. NOT anti-fraud — a stable per-install id the backend
 * logs. Pure module, no React.
 */

const DEVICE_KEY = "mfs.device";

const getInstallId = (): string => {
  try {
    const existing = window.localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return "no-store";
  }
};

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const getDeviceFingerprint = async (): Promise<string> => {
  if (typeof window === "undefined") return "";

  const parts = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    getInstallId(),
  ].join("|");

  try {
    const bytes = new TextEncoder().encode(parts);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return toHex(digest).slice(0, 16);
  } catch {
    return getInstallId().slice(0, 16);
  }
};
