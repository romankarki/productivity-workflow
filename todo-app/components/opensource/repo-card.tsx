"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrackedRepo } from "@/lib/hooks/use-repos";

interface RepoCardProps {
  repo: TrackedRepo;
  onRemove: (id: string) => void;
}

/** Clickable card that links to the per-repo detail view */
export function RepoCard({ repo, onRemove }: RepoCardProps) {
  return (
    <div className="group relative">
      <Link
        href={`/opensource/${repo.owner}/${repo.name}`}
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border/30 bg-card/60 p-4 transition-all duration-200",
          "hover:border-border/50 hover:bg-card/80 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        )}
      >
        <div className="rounded-lg bg-muted/30 p-2">
          <Github className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {repo.owner}/{repo.name}
          </p>
          <p className="text-xs text-muted-foreground/60">
            Click to view issues, PRs & notes
          </p>
        </div>
      </Link>

      {/* Remove button on hover */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          onRemove(repo.id);
        }}
        className="absolute right-2 top-2 h-6 w-6 rounded-full text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
