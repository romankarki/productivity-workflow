"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  StickyNote,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNotes } from "@/lib/hooks/use-notes";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScratchpadProps {
  taskListId: string;
  date: string;
  initialNotes?: string;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

export function Scratchpad({
  date,
  initialNotes = "",
  defaultExpanded = true,
  onToggle,
}: ScratchpadProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { notes, setNotes, isSaving, isSaved, lastSaved, error } = useNotes(
    date,
    initialNotes,
    { debounceMs: 500 }
  );

  // Sync with parent's expanded state
  useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [defaultExpanded]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && isExpanded) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(120, textarea.scrollHeight)}px`;
    }
  }, [notes, isExpanded]);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggle?.(newExpanded);
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes < 1) return "just now";
    if (minutes === 1) return "1 min ago";
    if (minutes < 60) return `${minutes} mins ago`;

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <TooltipProvider>
      <div className="rounded-xl border border-zinc-800/60 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 overflow-hidden backdrop-blur-sm">
        {/* Header */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleToggle}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10">
                  <StickyNote className="w-4 h-4 text-amber-400" />
                </div>
                <span className="font-medium text-zinc-200">Scratchpad</span>
                {!isExpanded && notes && (
                  <span className="text-xs text-zinc-500 ml-2 truncate max-w-[150px]">
                    {notes.split("\n")[0]}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Save status indicator */}
                {isExpanded && (
                  <div className="flex items-center gap-1.5 text-xs">
                    {isSaving ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
                        <span className="text-zinc-400">Saving...</span>
                      </>
                    ) : error ? (
                      <>
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span className="text-red-400">Error</span>
                      </>
                    ) : isSaved && lastSaved ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-zinc-500">
                          Saved {formatLastSaved(lastSaved)}
                        </span>
                      </>
                    ) : !isSaved ? (
                      <span className="text-zinc-500">Unsaved</span>
                    ) : null}
                  </div>
                )}
                <div className="h-6 w-6 flex items-center justify-center text-zinc-400">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            <p>{isExpanded ? "Collapse" : "Expand"} scratchpad</p>
            <p className="text-zinc-500">Ctrl+Shift+N</p>
          </TooltipContent>
        </Tooltip>

        {/* Expandable content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <div className="px-4 pb-4">
                <textarea
                  ref={textareaRef}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Quick notes, ideas, reminders for today..."
                  className={cn(
                    "w-full min-h-[120px] max-h-[400px] resize-y",
                    "bg-zinc-950/50 border border-zinc-800/60 rounded-lg",
                    "px-3 py-2.5 text-sm text-zinc-200",
                    "placeholder:text-zinc-600",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50",
                    "transition-all duration-200",
                    "font-mono leading-relaxed"
                  )}
                />
                {/* Character count */}
                <div className="flex items-center justify-end mt-2 text-xs text-zinc-600">
                  <span>{notes.length} characters</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
