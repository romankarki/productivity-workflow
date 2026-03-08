"use client";

import { useQuery } from "@tanstack/react-query";

export interface GitHubContribution {
  date: string;
  count: number;
  level: number;
}

export interface GitHubData {
  total: Record<string, number>;
  contributions: GitHubContribution[];
}

async function fetchGitHubContributions(
  username: string
): Promise<GitHubData | null> {
  const response = await fetch(
    `/api/github?username=${encodeURIComponent(username)}`
  );

  if (!response.ok) return null;

  const result = await response.json();
  return result.data;
}

export function useGitHubContributions(username: string | null | undefined) {
  return useQuery({
    queryKey: ["github", username],
    queryFn: () => fetchGitHubContributions(username!),
    enabled: !!username,
    staleTime: 10 * 60 * 1000,
  });
}
