import { useEffect, useState } from "react";
import {
  THEME_STORAGE_KEY,
  isTheme,
  type Theme,
} from "../data/architectures";

const THEME_COLORS: Record<Theme, string> = {
  atlas: "#f7f4ec",
  field: "#f3ebdd",
  lab: "#fcfdfe",
};

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // localStorage may be unavailable (private mode / SSR-like shells)
  }
  return "atlas";
}

function applyThemeChrome(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
}

export function usePersistedTheme() {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme());

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore write failures
    }
    applyThemeChrome(theme);
  }, [theme]);

  return [theme, setThemeState] as const;
}
