import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  hydrate: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "dark",

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    document.documentElement.classList.toggle("dark", next === "dark");
    set({ theme: next });
  },

  hydrate: () => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
    const theme = stored || "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
    set({ theme });
  },
}));
