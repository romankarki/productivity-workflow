"use client";

import { cn } from "@/lib/utils";
import { GitCommit, GitPullRequest, CircleDot, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ActivityItem } from "@/lib/hooks/use-repos";
import { Skeleton } from "@/components/ui/skeleton";

// Map activity type to icon and accent color
const typeConfig = {
  commit: {
    icon: GitCommit,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    label: "Commit",
  },
  pr: {
    icon: GitPullRequest,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "PR",
  },
  issue: {
    icon: CircleDot,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "Issue",
  },
} as const;

interface ActivityFeedProps {
  activity: ActivityItem[];
  isLoading: boolean;
}

export function ActivityFeed({ activity, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (activity.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No activity in the last 24 hours.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Activity refreshes every 5 minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activity.map((item) => {
        const config = typeConfig[item.type];
        const Icon = config.icon;

        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-border/20 bg-card/60 p-3 transition-all duration-200",
              "hover:border-border/50 hover:bg-card/80 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
            )}
          >
            {/* Type icon */}
            <div className={cn("mt-0.5 rounded-md p-1.5", config.bg)}>
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span className={cn("font-medium", config.color)}>
                  {config.label}
                </span>
                <span>·</span>
                <span className="truncate">{item.repo}</span>
                <span>·</span>
                <span>{item.author}</span>
                <span>·</span>
                <span className="shrink-0">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            {/* External link hint */}
            <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        );
      })}
    </div>
  );
}
