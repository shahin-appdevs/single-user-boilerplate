import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import {
  applyBackendTheme,
  resetBackendTheme,
  type BackendThemeColors,
} from "@/lib/theme";

interface ThemeState {
  colors: BackendThemeColors | null;
  version: string | null;
  setColors: (colors: BackendThemeColors, version?: string) => void;
  clear: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colors: null,
      version: null,
      setColors: (colors, version) => {
        applyBackendTheme(colors);
        set({ colors, version: version ?? null });
      },
      clear: () => {
        resetBackendTheme();
        set({ colors: null, version: null });
      },
    }),
    {
      name: "mfs-backend-theme",
      storage: createJSONStorage(() => localStorage),
      // Bump when the CSS default palette changes so a stale persisted override
      // can't clobber globals.css after hydration (deep color flashing back).
      version: 1,
      migrate: () => ({ colors: null, version: null }),
      partialize: (state) => ({
        colors: state.colors,
        version: state.version,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.colors) {
          applyBackendTheme(state.colors);
        }
      },
    },
  ),
);
