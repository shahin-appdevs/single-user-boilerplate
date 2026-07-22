/**
 * Pure JWT storage layer. No React, no axios.
 * Never stores or logs PIN. Never logs token contents.
 */

const ACCESS_KEY = "mfs.jwt";
const REMEMBER_KEY = "mfs.remember";

type Storage = "local" | "session";

export type JwtPayload = {
  exp?: number;
  iat?: number;
  sub?: string;
  [k: string]: unknown;
};

const isBrowser = (): boolean => typeof window !== "undefined";

const pickStorage = (mode: Storage): globalThis.Storage | null => {
  if (!isBrowser()) return null;
  try {
    return mode === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export const setToken = (token: string, remember: boolean): void => {
  const target = pickStorage(remember ? "local" : "session");
  const other = pickStorage(remember ? "session" : "local");
  const local = pickStorage("local");

  try {
    other?.removeItem(ACCESS_KEY);
  } catch {
    /* ignore */
  }
  try {
    target?.setItem(ACCESS_KEY, token);
  } catch {
    /* ignore */
  }
  try {
    local?.setItem(REMEMBER_KEY, remember ? "1" : "0");
  } catch {
    /* ignore */
  }
};

export const getToken = (): string | null => {
  const local = pickStorage("local");
  if (!local) return null;

  try {
    const remember = local.getItem(REMEMBER_KEY) === "1";
    const source = pickStorage(remember ? "local" : "session");
    return source?.getItem(ACCESS_KEY) ?? null;
  } catch {
    return null;
  }
};

export const clearToken = (): void => {
  try {
    pickStorage("local")?.removeItem(ACCESS_KEY);
  } catch {
    /* ignore */
  }
  try {
    pickStorage("session")?.removeItem(ACCESS_KEY);
  } catch {
    /* ignore */
  }
  try {
    pickStorage("local")?.removeItem(REMEMBER_KEY);
  } catch {
    /* ignore */
  }
};

const base64UrlDecode = (segment: string): string => {
  let s = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4;
  if (pad) s += "=".repeat(4 - pad);

  const binary = atob(s);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const decodeJwt = <T = JwtPayload>(token: string): T | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    return JSON.parse(base64UrlDecode(parts[1])) as T;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string, skewSeconds = 30): boolean => {
  const payload = decodeJwt(token);
  if (!payload || typeof payload.exp !== "number") return true;
  return payload.exp <= Date.now() / 1000 + skewSeconds;
};

export const getTokenExpiryMs = (token: string): number | null => {
  const payload = decodeJwt(token);
  return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
};
