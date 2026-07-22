import { create } from "zustand";

import {
  clearToken,
  decodeJwt,
  getToken,
  isTokenExpired,
  setToken,
} from "@/lib/auth/token";
import type { AuthStatus, Role, User } from "@/types/auth";

export type LogoutReason = "manual" | "idle" | "unauthorized" | "expired";

const DEFAULT_ROLE: Role = "user";

type AuthState = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  role: Role; // selected account type, persists across login <-> register
  intendedPath: string | null;
  bootstrap: () => void;
  setSession: (args: {
    token: string;
    user: User;
    remember: boolean;
    role?: Role;
  }) => void;
  setUser: (user: User | null) => void;
  setRole: (role: Role) => void;
  setIntendedPath: (path: string | null) => void;
  logout: (reason?: LogoutReason) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: "unknown",
  user: null,
  token: null,
  role: DEFAULT_ROLE,
  intendedPath: null,

  bootstrap: () => {
    const token = getToken();
    if (!token || isTokenExpired(token) || !decodeJwt(token)) {
      clearToken();
      set({ status: "unauthenticated", user: null, token: null });
      return;
    }
    set({ status: "authenticated", token });
  },

  setSession: ({ token, user, remember, role }) => {
    setToken(token, remember);
    set({
      token,
      user,
      role: role ?? user.role ?? DEFAULT_ROLE,
      status: "authenticated",
    });
  },

  setUser: (user) => set({ user }),

  setRole: (role) => set({ role }),

  setIntendedPath: (path) => set({ intendedPath: path }),

  // Does NOT navigate or clear the query cache — callers own that (keeps the
  // store framework-free; the AuthEventsBridge / useLogout handle the rest).
  logout: () => {
    clearToken();
    set({ user: null, token: null, role: DEFAULT_ROLE, status: "unauthenticated" });
  },
}));
