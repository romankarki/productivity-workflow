"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserId } from "./use-user";
import { StreakData } from "@/lib/utils/streak";

async function fetchStreak(): Promise<StreakData> {
  const userId = getUserId();

  if (!userId) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      streakDates: [],
      lastCompletedDate: null,
    };
  }

  const response = await fetch("/api/streaks", {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch streak data");
  }

  return response.json();
}

export function useStreak() {
  return useQuery({
    queryKey: ["streak"],
    queryFn: fetchStreak,
    staleTime: 60 * 1000, // 1 minute
  });
}
