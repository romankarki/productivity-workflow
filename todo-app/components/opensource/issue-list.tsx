"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CircleDot, MessageSquare, ChevronDown, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRepoIssues, useIssueDetail } from "@/lib/hooks/use-repos";
import { MarkdownBody } from "./markdown-body";
import { CommentThread } from "./comment-thread";
import { Skeleton } from "@/components/ui/skeleton";

interface IssueListProps {
  owner: string;
  repo: string;
}

/** Expandable issue detail loaded on demand */
function IssueDetail({ owner, repo, number }: { owner: string; repo: string; number: number }) {
  const { data, isLoading } = useIssueDetail(owner, repo, number);

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
      <MarkdownBody html={data.issue.bodyHtml} />
      {data.comments.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Comments ({data.comments.length})
          </p>
          <CommentThread comments={data.comments} />
        </div>
      )}
    </div>
  );
}

export function IssueList({ owner, repo }: IssueListProps) {
  const { data: issues = [], isLoading } = useRepoIssues(owner, repo);
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

  if (issues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CircleDot className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">No open issues.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {issues.map((issue) => {
        const isOpen = expandedId === issue.number;

        return (
          <div
            key={issue.number}
            className={cn(
              "rounded-lg border border-border/20 bg-card/60 transition-all duration-200",
              isOpen && "border-border/40 bg-card/80"
            )}
          >
            {/* Issue row */}
            <button
              onClick={() => setExpandedId(isOpen ? null : issue.number)}
              className="flex w-full items-start gap-3 p-3 text-left"
            >
              <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">
                  <span className="text-muted-foreground/60 mr-1.5">
                    #{issue.number}
                  </span>
                  {issue.title}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground/60">
                  <span>{issue.author}</span>
                  <span>·</span>
                  <span>
                    {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                  </span>
                  {issue.labels.map((l) => (
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
                {issue.comments > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                    <MessageSquare className="h-3 w-3" />
                    {issue.comments}
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
                <IssueDetail owner={owner} repo={repo} number={issue.number} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
