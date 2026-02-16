"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface RepoInputProps {
  onAdd: (owner: string, name: string) => Promise<void>;
  isLoading: boolean;
}

/** Input field that accepts "owner/repo" format and splits it for the API */
export function RepoInput({ onAdd, isLoading }: RepoInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Accept formats: "owner/repo" or full GitHub URLs
    const cleaned = value
      .trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//, "")
      .replace(/\/$/, "");

    const parts = cleaned.split("/");
    if (parts.length < 2 || !parts[0] || !parts[1]) {
      setError("Use format: owner/repo (e.g. vercel/next.js)");
      return;
    }

    try {
      await onAdd(parts[0], parts[1]);
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add repo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 space-y-1">
        <Input
          placeholder="owner/repo or GitHub URL"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          disabled={isLoading}
          className="h-9"
        />
        {error && (
          <p className="text-xs text-destructive px-1">{error}</p>
        )}
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={isLoading || !value.trim()}
        className="h-9 gap-1.5"
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Plus className="h-3.5 w-3.5" />
        )}
        Add
      </Button>
    </form>
  );
}
