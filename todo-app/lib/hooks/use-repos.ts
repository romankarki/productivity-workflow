"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";

// --- Types ---

export interface TrackedRepo {
  id: string;
  userId: string;
  owner: string;
  name: string;
  notes: string | null;
  addedAt: string;
}

export interface RepoIssue {
  number: number;
  title: string;
  state: string;
  author: string;
  avatarUrl: string;
  labels: { name: string; color: string }[];
  comments: number;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface IssueDetail {
  number: number;
  title: string;
  state: string;
  author: string;
  avatarUrl: string;
  bodyHtml: string;
  labels: { name: string; color: string }[];
  comments: number;
  createdAt: string;
  url: string;
}

export interface Comment {
  id: number;
  author: string;
  avatarUrl: string;
  bodyHtml: string;
  path?: string | null;
  line?: number | null;
  createdAt: string;
}

export interface RepoPR {
  number: number;
  title: string;
  state: string;
  draft: boolean;
  author: string;
  avatarUrl: string;
  labels: { name: string; color: string }[];
  comments: number;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export interface PRDetail {
  number: number;
  title: string;
  state: string;
  draft: boolean;
  merged: boolean;
  author: string;
  avatarUrl: string;
  bodyHtml: string;
  labels: { name: string; color: string }[];
  additions: number;
  deletions: number;
  changedFiles: number;
  createdAt: string;
  url: string;
}

export interface PRFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch: string | null;
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
    refetchInterval: 5 * 60 * 1000,
    staleTime: 2 * 60 * 1000,
  });
}

// --- Per-repo GitHub data hooks ---

export function useRepoIssues(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repoIssues", owner, repo],
    queryFn: async (): Promise<RepoIssue[]> => {
      const res = await fetch(`/api/github/${owner}/${repo}/issues`);
      if (!res.ok) throw new Error("Failed to fetch issues");
      const data = await res.json();
      return data.issues;
    },
    enabled: !!owner && !!repo,
    staleTime: 2 * 60 * 1000,
  });
}

export function useIssueDetail(owner: string, repo: string, number: number | null) {
  return useQuery({
    queryKey: ["issueDetail", owner, repo, number],
    queryFn: async (): Promise<{ issue: IssueDetail; comments: Comment[] }> => {
      const res = await fetch(`/api/github/${owner}/${repo}/issues/${number}`);
      if (!res.ok) throw new Error("Failed to fetch issue detail");
      return res.json();
    },
    enabled: !!owner && !!repo && number !== null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRepoPRs(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repoPRs", owner, repo],
    queryFn: async (): Promise<RepoPR[]> => {
      const res = await fetch(`/api/github/${owner}/${repo}/pulls`);
      if (!res.ok) throw new Error("Failed to fetch pull requests");
      const data = await res.json();
      return data.pulls;
    },
    enabled: !!owner && !!repo,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePRDetail(owner: string, repo: string, number: number | null) {
  return useQuery({
    queryKey: ["prDetail", owner, repo, number],
    queryFn: async (): Promise<{ pr: PRDetail; comments: Comment[]; files: PRFile[] }> => {
      const res = await fetch(`/api/github/${owner}/${repo}/pulls/${number}`);
      if (!res.ok) throw new Error("Failed to fetch PR detail");
      return res.json();
    },
    enabled: !!owner && !!repo && number !== null,
    staleTime: 2 * 60 * 1000,
  });
}

// --- Per-repo notes hooks ---

export function useRepoNotes(repoId: string | null) {
  return useQuery({
    queryKey: ["repoNotes", repoId],
    queryFn: async (): Promise<string> => {
      const userId = getUserId();
      if (!userId) return "";
      const res = await fetch(`/api/repos/${repoId}`, {
        headers: { "x-user-id": userId },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      return data.repo.notes ?? "";
    },
    enabled: !!repoId,
    staleTime: 30 * 1000,
  });
}

export function useUpdateRepoNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ repoId, notes }: { repoId: string; notes: string }) => {
      const userId = getUserId();
      if (!userId) throw new Error("Not authenticated");

      const res = await fetch(`/api/repos/${repoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      return res.json();
    },
    onSuccess: (_, { repoId }) => {
      queryClient.invalidateQueries({ queryKey: ["repoNotes", repoId] });
    },
  });
}
