"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";

async function updateDailyWins(date: string, dailyWins: string): Promise<void> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`/api/tasklists/${date}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ dailyWins }),
  });

  if (!response.ok) {
    throw new Error("Failed to save daily wins");
  }
}

function parseWins(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function serializeWins(wins: string[]): string {
  return wins.join("\n");
}

interface UseDailyWinsOptions {
  debounceMs?: number;
}

interface UseDailyWinsReturn {
  wins: string[];
  addWin: (win: string) => void;
  removeWin: (index: number) => void;
  isSaving: boolean;
  isSaved: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

export function useDailyWins(
  date: string,
  initialDailyWins: string = "",
  options: UseDailyWinsOptions = {}
): UseDailyWinsReturn {
  const { debounceMs = 500 } = options;

  const [wins, setWins] = useState<string[]>(parseWins(initialDailyWins));
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (serializedWins: string) => updateDailyWins(date, serializedWins),
    onSuccess: () => {
      setLastSaved(new Date());
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ["taskList", date] });
    },
    onError: () => {
      setIsSaved(false);
    },
  });

  useEffect(() => {
    setWins(parseWins(initialDailyWins));
  }, [initialDailyWins]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const scheduleSave = useCallback(
    (nextWins: string[]) => {
      setIsSaved(false);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        mutation.mutate(serializeWins(nextWins));
      }, debounceMs);
    },
    [debounceMs, mutation]
  );

  const addWin = useCallback(
    (win: string) => {
      const trimmed = win.trim();
      if (!trimmed) return;

      setWins((prev) => {
        const next = [...prev, trimmed];
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  const removeWin = useCallback(
    (index: number) => {
      setWins((prev) => {
        const next = prev.filter((_, i) => i !== index);
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  return {
    wins,
    addWin,
    removeWin,
    isSaving: mutation.isPending,
    isSaved,
    lastSaved,
    error: mutation.error,
  };
}
