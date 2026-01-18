"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Plus, Loader2 } from "lucide-react";

interface TaskInputProps {
  onSubmit: (title: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

export function TaskInput({
  onSubmit,
  isLoading = false,
  placeholder = "Add a task...",
}: TaskInputProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;

    try {
      await onSubmit(trimmed);
      setValue("");
      // Keep focus for rapid task entry
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setValue("");
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-lg border-2 border-dashed px-4 py-3 transition-all duration-200",
        isFocused
          ? "border-primary/50 bg-primary/5"
          : "border-border/40 bg-muted/20 hover:border-border/60 hover:bg-muted/30"
      )}
    >
      {/* Plus Icon / Loading */}
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center transition-colors",
          isFocused ? "text-primary" : "text-muted-foreground"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={isLoading}
        className={cn(
          "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60",
          isLoading && "cursor-not-allowed opacity-50"
        )}
      />

      {/* Hint */}
      {value.trim() && !isLoading && (
        <span className="hidden text-xs text-muted-foreground sm:block">
          Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to add
        </span>
      )}
    </div>
  );
}
