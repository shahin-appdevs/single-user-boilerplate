"use client";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/themeStore";

export function BackendThemeDemo() {
  return (
    <div className="flex gap-3">
      <Button
        onClick={() =>
          useThemeStore.getState().setColors({
            primary: "#6d28d9",
            "primary-foreground": "#ffffff",
          })
        }
      >
        Apply backend theme (demo)
      </Button>
      <Button variant="outline" onClick={() => useThemeStore.getState().clear()}>
        Reset
      </Button>
    </div>
  );
}
