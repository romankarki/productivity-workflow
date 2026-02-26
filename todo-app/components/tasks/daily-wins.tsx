"use client";

import { useState } from "react";
import { Trophy, Plus, X, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDailyWins } from "@/lib/hooks/use-daily-wins";

interface DailyWinsProps {
  date: string;
  initialDailyWins?: string;
}

export function DailyWins({ date, initialDailyWins = "" }: DailyWinsProps) {
  const [newWin, setNewWin] = useState("");
  const { wins, addWin, removeWin, isSaving, isSaved, lastSaved, error } =
    useDailyWins(date, initialDailyWins, { debounceMs: 500 });

  const handleAddWin = () => {
    const trimmed = newWin.trim();
    if (!trimmed) return;
    addWin(trimmed);
    setNewWin("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddWin();
    }
  };

  const formatLastSaved = (savedAt: Date) => {
    const now = new Date();
    const diff = now.getTime() - savedAt.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes < 1) return "just now";
    if (minutes === 1) return "1 min ago";
    if (minutes < 60) return `${minutes} mins ago`;

    return savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-amber-500/10 p-1.5">
            <Trophy className="h-4 w-4 text-amber-400" />
          </span>
          <div>
            <h3 className="text-sm font-medium">Daily Wins</h3>
            <p className="text-xs text-muted-foreground">
              Capture today&apos;s progress
            </p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {isSaving ? (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving
            </span>
          ) : error ? (
            <span className="inline-flex items-center gap-1 text-destructive">
              <AlertCircle className="h-3 w-3" />
              Error
            </span>
          ) : isSaved && lastSaved ? (
            <span className="inline-flex items-center gap-1 text-emerald-500">
              <Check className="h-3 w-3" />
              {formatLastSaved(lastSaved)}
            </span>
          ) : (
            "Unsaved"
          )}
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Input
          value={newWin}
          onChange={(e) => setNewWin(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a win from today..."
          className="h-8 text-sm"
        />
        <Button
          size="sm"
          onClick={handleAddWin}
          disabled={!newWin.trim()}
          className="h-8 gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      <div className="space-y-1.5">
        {wins.length === 0 && (
          <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            No wins yet. Add a small victory to end the day strong.
          </div>
        )}

        {wins.map((win, index) => (
          <div
            key={`${win}-${index}`}
            className={cn(
              "flex items-start gap-2 rounded-lg border border-border/30 bg-background/40 px-2.5 py-2",
              "transition-colors hover:border-border/60"
            )}
          >
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400/80" />
            <p className="min-w-0 flex-1 text-sm text-foreground/90">{win}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeWin(index)}
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
              title="Remove win"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
