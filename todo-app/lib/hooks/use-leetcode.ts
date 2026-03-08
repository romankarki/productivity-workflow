"use client";

import { useQuery } from "@tanstack/react-query";

export interface LeetCodeData {
  username: string;
  ranking: number | null;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number | null;
  contestGlobalRanking: number | null;
  contestsAttended: number;
  topPercentage: number | null;
}

async function fetchLeetCodeStats(
  username: string
): Promise<LeetCodeData | null> {
  const response = await fetch(
    `/api/leetcode?username=${encodeURIComponent(username)}`
  );

  if (!response.ok) return null;

  const result = await response.json();
  return result.data;
}

export function useLeetCodeStats(username: string | null | undefined) {
  return useQuery({
    queryKey: ["leetcode", username],
    queryFn: () => fetchLeetCodeStats(username!),
    enabled: !!username,
    staleTime: 60 * 60 * 1000,
  });
}
