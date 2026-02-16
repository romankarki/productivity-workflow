"use client";

import { cn } from "@/lib/utils";
import type { PRFile } from "@/lib/hooks/use-repos";
import { File, Plus, Minus } from "lucide-react";

interface DiffViewerProps {
  files: PRFile[];
}

// Map file status to a human-readable badge
const statusConfig: Record<string, { label: string; className: string }> = {
  added: { label: "Added", className: "text-emerald-400 bg-emerald-500/10" },
  removed: { label: "Deleted", className: "text-red-400 bg-red-500/10" },
  modified: { label: "Modified", className: "text-blue-400 bg-blue-500/10" },
  renamed: { label: "Renamed", className: "text-amber-400 bg-amber-500/10" },
};

/** Renders unified diff patches for changed files with +/- line coloring */
export function DiffViewer({ files }: DiffViewerProps) {
  if (files.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No file changes.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => {
        const config = statusConfig[file.status] ?? statusConfig.modified;

        return (
          <div
            key={file.filename}
            className="overflow-hidden rounded-lg border border-border/20"
          >
            {/* File header */}
            <div className="flex items-center gap-2 border-b border-border/20 bg-muted/20 px-3 py-2">
              <File className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="flex-1 truncate text-xs font-mono text-foreground">
                {file.filename}
              </span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-medium",
                  config.className
                )}
              >
                {config.label}
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-0.5 text-emerald-400">
                  <Plus className="h-3 w-3" />
                  {file.additions}
                </span>
                <span className="flex items-center gap-0.5 text-red-400">
                  <Minus className="h-3 w-3" />
                  {file.deletions}
                </span>
              </div>
            </div>

            {/* Diff patch */}
            {file.patch ? (
              <pre className="max-h-[400px] overflow-auto p-0 text-xs leading-5">
                {file.patch.split("\n").map((line, i) => {
                  let lineClass = "px-3 text-muted-foreground";
                  if (line.startsWith("+")) {
                    lineClass = "px-3 bg-emerald-500/10 text-emerald-300";
                  } else if (line.startsWith("-")) {
                    lineClass = "px-3 bg-red-500/10 text-red-300";
                  } else if (line.startsWith("@@")) {
                    lineClass = "px-3 bg-blue-500/8 text-blue-400 font-medium";
                  }

                  return (
                    <div key={i} className={lineClass}>
                      <code>{line}</code>
                    </div>
                  );
                })}
              </pre>
            ) : (
              <p className="px-3 py-2 text-xs text-muted-foreground italic">
                Binary file or diff too large to display.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
