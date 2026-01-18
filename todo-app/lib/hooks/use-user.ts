"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@/lib/types/user";

const USER_ID_KEY = "pomodoro_user_id";

// Helper to get userId from localStorage
export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

// Helper to set userId in localStorage
export function setUserId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_ID_KEY, id);
}

// Helper to clear userId from localStorage
export function clearUserId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_ID_KEY);
}

// Fetch user data
async function fetchUser(): Promise<User | null> {
  const userId = getUserId();

  const response = await fetch("/api/user", {
    headers: userId ? { "x-user-id": userId } : {},
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const data = await response.json();
  return data.user;
}

// Create user
async function createUser(username: string): Promise<User> {
  const response = await fetch("/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create user");
  }

  const data = await response.json();
  return data.user;
}

// Update user
async function updateUser(username: string): Promise<User> {
  const userId = getUserId();

  if (!userId) {
    throw new Error("No user ID found");
  }

  const response = await fetch("/api/user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update user");
  }

  const data = await response.json();
  return data.user;
}

// Hook to get current user
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });
}

// Hook to create user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (user) => {
      setUserId(user.id);
      queryClient.setQueryData(["user"], user);
    },
  });
}

// Hook to update user
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
    },
  });
}
