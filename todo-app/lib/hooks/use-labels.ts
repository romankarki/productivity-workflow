"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";
import { Label, CreateLabelInput, UpdateLabelInput } from "@/lib/types/label";

async function fetchLabels(): Promise<Label[]> {
  const userId = getUserId();
  if (!userId) return [];

  const response = await fetch("/api/labels", {
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch labels");
  }

  const data = await response.json();
  return data.labels;
}

async function createLabel(data: CreateLabelInput): Promise<Label> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch("/api/labels", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create label");
  }

  const result = await response.json();
  return result.label;
}

async function updateLabel(id: string, data: UpdateLabelInput): Promise<Label> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch(`/api/labels/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update label");
  }

  const result = await response.json();
  return result.label;
}

async function deleteLabel(id: string): Promise<void> {
  const userId = getUserId();
  if (!userId) throw new Error("Not authenticated");

  const response = await fetch(`/api/labels/${id}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  });

  if (!response.ok) {
    throw new Error("Failed to delete label");
  }
}

export function useLabels() {
  return useQuery({
    queryKey: ["labels"],
    queryFn: fetchLabels,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLabelInput }) =>
      updateLabel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLabel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}
