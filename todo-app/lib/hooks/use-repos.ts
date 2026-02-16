"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";

// --- Types ---

export interface TrackedRepo {
  id: string;
  userId: string;
  owner: string;
  name: string;
  addedAt: string;
}

export interface ActivityItem {
  id: string;
  type: "commit" | "pr" | "issue";
  repo: string;
  title: string;
  url: string;
  author: string;
  avatarUrl: string;
  createdAt: string;
}

// --- Fetchers ---

async function fetchRepos(): Promise<TrackedRepo[]> {
  const userId = getUserId();
  if (!userId) return [];

  const res = await fetch("/api/repos", {
    headers: { "x-user-id": userId },
  });
  if (!res.ok) throw new Error("Failed to fetch repos");

  const data = await res.json();
  return data.repos;
}

async function addRepo(input: { owner: string; name: string }): Promise<TrackedRepo> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const res = await fetch("/api/repos", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to add repo");
  }

  const data = await res.json();
  return data.repo;
}

async function removeRepo(id: string): Promise<void> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const res = await fetch(`/api/repos/${id}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });

  if (!res.ok) throw new Error("Failed to remove repo");
}

async function fetchActivity(): Promise<ActivityItem[]> {
  const userId = getUserId();
  if (!userId) return [];

  const res = await fetch("/api/repos/activity", {
    headers: { "x-user-id": userId },
  });
  if (!res.ok) throw new Error("Failed to fetch activity");

  const data = await res.json();
  return data.activity;
}

// --- Hooks ---

export function useTrackedRepos() {
  return useQuery({
    queryKey: ["trackedRepos"],
    queryFn: fetchRepos,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRepo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackedRepos"] });
      // Also refresh activity since there's a new repo
      queryClient.invalidateQueries({ queryKey: ["repoActivity"] });
    },
  });
}

export function useRemoveRepo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeRepo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trackedRepos"] });
      queryClient.invalidateQueries({ queryKey: ["repoActivity"] });
    },
  });
}

export function useRepoActivity() {
  return useQuery({
    queryKey: ["repoActivity"],
    queryFn: fetchActivity,
    // Refetch every 5 minutes to stay current
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });
}
