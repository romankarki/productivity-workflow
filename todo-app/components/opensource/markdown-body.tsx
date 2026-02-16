"use client";

import { cn } from "@/lib/utils";

interface MarkdownBodyProps {
  html: string;
  className?: string;
}

/** Renders GitHub's pre-rendered body_html safely with consistent styling */
export function MarkdownBody({ html, className }: MarkdownBodyProps) {
  if (!html) {
    return (
      <p className="text-sm italic text-muted-foreground">No description provided.</p>
    );
  }

  return (
    <div
      className={cn(
        // Base prose styling for GitHub markdown content
        "prose prose-sm prose-invert max-w-none",
        "prose-headings:text-foreground prose-headings:font-semibold",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-code:rounded prose-code:bg-muted/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:text-foreground",
        "prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-border/30 prose-pre:rounded-lg",
        "prose-img:rounded-lg prose-img:border prose-img:border-border/30",
        "prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground",
        "prose-li:text-muted-foreground",
        "[&_table]:border [&_table]:border-border/30 [&_td]:border [&_td]:border-border/30 [&_td]:px-3 [&_td]:py-1.5 [&_th]:border [&_th]:border-border/30 [&_th]:px-3 [&_th]:py-1.5 [&_th]:bg-muted/30",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
