"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark" | "pitch-black" | "monokai";

const STORAGE_KEY = "pomodoro_theme";

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeInternal] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && ["light", "dark", "pitch-black", "monokai"].includes(stored)) {
      setThemeInternal(stored);
      applyTheme(stored);
    } else {
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    // Remove all theme classes
    html.classList.remove("light", "dark", "pitch-black", "monokai");
    // Add the new theme class
    html.classList.add(newTheme);
  };

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeInternal(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  return {
    theme,
    setTheme,
    mounted,
  };
}

// Theme metadata for UI
export const themes: Array<{
  id: Theme;
  name: string;
  description: string;
  colors: {
    bg: string;
    card: string;
    accent: string;
  };
}> = [
  {
    id: "light",
    name: "Light",
    description: "Clean and bright",
    colors: {
      bg: "#ffffff",
      card: "#f4f4f5",
      accent: "#3b82f6",
    },
  },
  {
    id: "dark",
    name: "Dark",
    description: "Easy on the eyes",
    colors: {
      bg: "#18181b",
      card: "#27272a",
      accent: "#a1a1aa",
    },
  },
  {
    id: "pitch-black",
    name: "Pitch Black",
    description: "Perfect for OLED",
    colors: {
      bg: "#000000",
      card: "#0a0a0a",
      accent: "#404040",
    },
  },
  {
    id: "monokai",
    name: "Monokai",
    description: "Classic code editor",
    colors: {
      bg: "#272822",
      card: "#3e3d32",
      accent: "#f92672",
    },
  },
];
