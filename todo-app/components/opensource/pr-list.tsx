"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GitPullRequest, MessageSquare, ChevronDown, Loader2, FileCode } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRepoPRs, usePRDetail } from "@/lib/hooks/use-repos";
import { MarkdownBody } from "./markdown-body";
import { CommentThread } from "./comment-thread";
import { DiffViewer } from "./diff-viewer";
import { Skeleton } from "@/components/ui/skeleton";

interface PRListProps {
  owner: string;
  repo: string;
}

/** Expandable PR detail loaded on demand */
function PRDetailView({ owner, repo, number }: { owner: string; repo: string; number: number }) {
  const { data, isLoading } = usePRDetail(owner, repo, number);
  const [showFiles, setShowFiles] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4 border-t border-border/20 pt-3 mt-3">
      {/* PR stats */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-emerald-400">+{data.pr.additions}</span>
        <span className="text-red-400">-{data.pr.deletions}</span>
        <span className="text-muted-foreground">
          {data.pr.changedFiles} file{data.pr.changedFiles !== 1 ? "s" : ""} changed
        </span>
        {data.pr.merged && (
          <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-violet-400 font-medium">
            Merged
          </span>
        )}
        {data.pr.draft && (
          <span className="rounded bg-muted/40 px-1.5 py-0.5 text-muted-foreground">
            Draft
          </span>
        )}
      </div>

      {/* PR body */}
      <MarkdownBody html={data.pr.bodyHtml} />

      {/* Changed files toggle */}
      <button
        onClick={() => setShowFiles(!showFiles)}
        className="flex items-center gap-2 text-xs font-medium text-primary hover:underline"
      >
        <FileCode className="h-3.5 w-3.5" />
        {showFiles ? "Hide" : "Show"} changed files ({data.files.length})
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform",
            showFiles && "rotate-180"
          )}
        />
      </button>

      {showFiles && <DiffViewer files={data.files} />}

      {/* Review comments */}
      {data.comments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Review Comments ({data.comments.length})
          </p>
          <CommentThread comments={data.comments} />
        </div>
      )}
    </div>
  );
}

export function PRList({ owner, repo }: PRListProps) {
  const { data: pulls = [], isLoading } = useRepoPRs(owner, repo);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (pulls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <GitPullRequest className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">No open pull requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pulls.map((pr) => {
        const isOpen = expandedId === pr.number;

        return (
          <div
            key={pr.number}
            className={cn(
              "rounded-lg border border-border/20 bg-card/60 transition-all duration-200",
              isOpen && "border-border/40 bg-card/80"
            )}
          >
            {/* PR row */}
            <button
              onClick={() => setExpandedId(isOpen ? null : pr.number)}
              className="flex w-full items-start gap-3 p-3 text-left"
            >
              <GitPullRequest
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  pr.draft ? "text-muted-foreground" : "text-emerald-400"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">
                  <span className="text-muted-foreground/60 mr-1.5">
                    #{pr.number}
                  </span>
                  {pr.title}
                  {pr.draft && (
                    <span className="ml-1.5 text-xs text-muted-foreground">(draft)</span>
                  )}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground/60">
                  <span>{pr.author}</span>
                  <span>·</span>
                  <span>
                    {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
                  </span>
                  {pr.labels.map((l) => (
                    <span
                      key={l.name}
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `#${l.color}20`,
                        color: `#${l.color}`,
                      }}
                    >
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {pr.comments > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                    <MessageSquare className="h-3 w-3" />
                    {pr.comments}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground/40 transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            </button>

            {/* Expanded detail */}
            {isOpen && (
              <div className="px-3 pb-3 pl-10">
                <PRDetailView owner={owner} repo={repo} number={pr.number} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
