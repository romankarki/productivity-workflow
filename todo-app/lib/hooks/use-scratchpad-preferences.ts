"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "pomodoro_scratchpad_expanded";

interface UseScratchpadPreferencesReturn {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  toggleExpanded: () => void;
}

export function useScratchpadPreferences(): UseScratchpadPreferencesReturn {
  const [isExpanded, setIsExpandedInternal] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsExpandedInternal(stored === "true");
    }
  }, []);

  const setIsExpanded = useCallback((expanded: boolean) => {
    setIsExpandedInternal(expanded);
    localStorage.setItem(STORAGE_KEY, String(expanded));
  }, []);

  const toggleExpanded = useCallback(() => {
    setIsExpandedInternal((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  // Return default expanded state during SSR
  if (!mounted) {
    return {
      isExpanded: true,
      setIsExpanded: () => {},
      toggleExpanded: () => {},
    };
  }

  return {
    isExpanded,
    setIsExpanded,
    toggleExpanded,
  };
}
