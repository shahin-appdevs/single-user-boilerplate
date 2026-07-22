import { create } from "zustand";

type UiState = {
  /** Mobile sidebar drawer open. */
  sidebarOpen: boolean;
  /** BalanceHero eye toggle (used from Task 4 on). */
  balanceHidden: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleBalanceHidden: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  balanceHidden: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleBalanceHidden: () => set((s) => ({ balanceHidden: !s.balanceHidden })),
}));
