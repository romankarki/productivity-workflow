"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useRepoNotes, useUpdateRepoNotes } from "@/lib/hooks/use-repos";
import { StickyNote, Check, Loader2 } from "lucide-react";

interface RepoNotesProps {
  repoId: string;
}

/** Per-repo notes editor with auto-save debounce */
export function RepoNotes({ repoId }: RepoNotesProps) {
  const { data: savedNotes = "", isLoading } = useRepoNotes(repoId);
  const updateNotes = useUpdateRepoNotes();

  const [localNotes, setLocalNotes] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial value from server
  useEffect(() => {
    setLocalNotes(savedNotes);
  }, [savedNotes]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(200, el.scrollHeight)}px`;
    }
  }, [localNotes]);

  const save = useCallback(
    (text: string) => {
      updateNotes.mutate(
        { repoId, notes: text },
        { onSuccess: () => setIsSaved(true) }
      );
    },
    [repoId, updateNotes]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setLocalNotes(text);
    setIsSaved(false);

    // Debounce save by 800ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(text), 800);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <StickyNote className="h-4 w-4 text-amber-400" />
          <span>Personal notes for this repo</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
          {updateNotes.isPending ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span>Saved</span>
            </>
          ) : (
            <span>Unsaved</span>
          )}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={localNotes}
        onChange={handleChange}
        placeholder="Write notes about this repo... study plan, things to review, interesting patterns..."
        className={cn(
          "w-full min-h-[200px] max-h-[500px] resize-y",
          "bg-zinc-950/50 border border-zinc-800/60 rounded-lg",
          "px-3 py-2.5 text-sm text-zinc-200",
          "placeholder:text-zinc-600",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50",
          "transition-all duration-200",
          "font-mono leading-relaxed"
        )}
      />
    </div>
  );
}
