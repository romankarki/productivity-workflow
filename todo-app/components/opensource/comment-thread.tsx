"use client";

import { formatDistanceToNow } from "date-fns";
import { MarkdownBody } from "./markdown-body";
import type { Comment } from "@/lib/hooks/use-repos";

interface CommentThreadProps {
  comments: Comment[];
}

/** Renders a list of GitHub comments with author avatars and timestamps */
export function CommentThread({ comments }: CommentThreadProps) {
  if (comments.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No comments yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border border-border/20 bg-muted/10 p-3"
        >
          {/* Comment header */}
          <div className="mb-2 flex items-center gap-2">
            {comment.avatarUrl && (
              <img
                src={comment.avatarUrl}
                alt={comment.author}
                className="h-5 w-5 rounded-full"
              />
            )}
            <span className="text-xs font-medium text-foreground">
              {comment.author}
            </span>
            {comment.path && (
              <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                {comment.path}
                {comment.line ? `:${comment.line}` : ""}
              </span>
            )}
            <span className="text-xs text-muted-foreground/60">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Comment body */}
          <MarkdownBody html={comment.bodyHtml} />
        </div>
      ))}
    </div>
  );
}
