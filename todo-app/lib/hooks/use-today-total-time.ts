"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserId } from "./use-user";

async function fetchTodayTotalTime(): Promise<number> {
  const userId = getUserId();
  if (!userId) return 0;

  const response = await fetch("/api/stopwatches/today", {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) return 0;

  const data = await response.json();
  return data.totalDuration ?? 0;
}

export function useTodayTotalTime() {
  return useQuery({
    queryKey: ["stopwatches", "today-total"],
    queryFn: fetchTodayTotalTime,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}
