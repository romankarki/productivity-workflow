"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";
import {
  Contest,
  CreateContestInput,
  UpdateContestInput,
} from "@/lib/types/contest";
import { toastActions } from "./use-toast-actions";

async function fetchContests(): Promise<Contest[]> {
  const userId = getUserId();
  if (!userId) return [];

  const response = await fetch("/api/contests", {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contests");
  }

  const data = await response.json();
  return data.contests;
}

async function createContest(data: CreateContestInput): Promise<Contest> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch("/api/contests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create contest");
  }

  const result = await response.json();
  return result.contest;
}

async function updateContest(
  id: string,
  data: UpdateContestInput
): Promise<Contest> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch(`/api/contests/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update contest");
  }

  const result = await response.json();
  return result.contest;
}

async function deleteContest(id: string): Promise<void> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch(`/api/contests/${id}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    throw new Error("Failed to delete contest");
  }
}

export function useContests() {
  return useQuery({
    queryKey: ["contests"],
    queryFn: fetchContests,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateContest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      toastActions.success("Contest added");
    },
    onError: () => {
      toastActions.error("Failed to add contest");
    },
  });
}

export function useUpdateContest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContestInput }) =>
      updateContest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      toastActions.success("Contest updated");
    },
    onError: () => {
      toastActions.error("Failed to update contest");
    },
  });
}

export function useDeleteContest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contests"] });
      toastActions.success("Contest deleted");
    },
    onError: () => {
      toastActions.error("Failed to delete contest");
    },
  });
}
