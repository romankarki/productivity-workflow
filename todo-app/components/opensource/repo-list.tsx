"use client";

import { Button } from "@/components/ui/button";
import { X, Github } from "lucide-react";
import type { TrackedRepo } from "@/lib/hooks/use-repos";

interface RepoListProps {
  repos: TrackedRepo[];
  onRemove: (id: string) => void;
  isRemoving: boolean;
}

/** Shows tracked repos as compact chips with a remove button */
export function RepoList({ repos, onRemove, isRemoving }: RepoListProps) {
  if (repos.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {repos.map((repo) => (
        <div
          key={repo.id}
          className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-sm transition-colors hover:border-border/60"
        >
          <Github className="h-3.5 w-3.5 text-muted-foreground" />
          <a
            href={`https://github.com/${repo.owner}/${repo.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors"
          >
            {repo.owner}/{repo.name}
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(repo.id)}
            disabled={isRemoving}
            className="h-5 w-5 rounded-full text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
