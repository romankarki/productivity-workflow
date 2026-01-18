"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserId } from "./use-user";

// Update notes for a task list
async function updateNotes(date: string, notes: string): Promise<void> {
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
    body: JSON.stringify({ notes }),
  });

  if (!response.ok) {
    throw new Error("Failed to save notes");
  }
}

interface UseNotesOptions {
  debounceMs?: number;
}

interface UseNotesReturn {
  notes: string;
  setNotes: (notes: string) => void;
  isSaving: boolean;
  isSaved: boolean;
  lastSaved: Date | null;
  error: Error | null;
}

export function useNotes(
  date: string,
  initialNotes: string = "",
  options: UseNotesOptions = {}
): UseNotesReturn {
  const { debounceMs = 500 } = options;

  const [notes, setNotesInternal] = useState(initialNotes);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNotes: string) => updateNotes(date, newNotes),
    onSuccess: () => {
      setLastSaved(new Date());
      setIsSaved(true);
      // Invalidate the task list query to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["taskList", date] });
    },
    onError: () => {
      setIsSaved(false);
    },
  });

  // Sync with initialNotes when it changes (e.g., when data is fetched)
  useEffect(() => {
    setNotesInternal(initialNotes);
  }, [initialNotes]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const setNotes = useCallback(
    (newNotes: string) => {
      setNotesInternal(newNotes);
      setIsSaved(false);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced save
      debounceTimerRef.current = setTimeout(() => {
        mutation.mutate(newNotes);
      }, debounceMs);
    },
    [debounceMs, mutation]
  );

  return {
    notes,
    setNotes,
    isSaving: mutation.isPending,
    isSaved,
    lastSaved,
    error: mutation.error,
  };
}
