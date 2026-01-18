"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLabels, useCreateLabel } from "@/lib/hooks/use-labels";
import { Label } from "@/lib/types/label";
import { Check, Plus, Search, Tags, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRESET_COLORS } from "./color-picker";

interface LabelSelectorProps {
  selectedLabels: Label[];
  onToggle: (labelId: string) => void;
  children: React.ReactNode;
}

export function LabelSelector({
  selectedLabels,
  onToggle,
  children,
}: LabelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");

  const { data: labels, isLoading } = useLabels();
  const createLabel = useCreateLabel();

  const filteredLabels = labels?.filter((label) =>
    label.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedIds = new Set(selectedLabels.map((l) => l.id));

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;

    try {
      const newLabel = await createLabel.mutateAsync({
        name: newLabelName.trim(),
        color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)],
      });
      onToggle(newLabel.id);
      setNewLabelName("");
      setIsCreating(false);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search labels..."
            className="h-9 pl-8"
          />
        </div>

        {/* Labels List */}
        <ScrollArea className="h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLabels && filteredLabels.length > 0 ? (
            <div className="space-y-1">
              {filteredLabels.map((label) => {
                const isSelected = selectedIds.has(label.id);
                return (
                  <button
                    key={label.id}
                    onClick={() => onToggle(label.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      "hover:bg-muted",
                      isSelected && "bg-muted"
                    )}
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="flex-1 text-left">{label.name}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : search && !isCreating ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">No labels found</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewLabelName(search);
                  setIsCreating(true);
                }}
                className="mt-2"
              >
                Create &quot;{search}&quot;
              </Button>
            </div>
          ) : !isCreating ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Tags className="h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">No labels yet</p>
            </div>
          ) : null}

          {/* Create New Label */}
          {isCreating && (
            <div className="space-y-2 border-t pt-2">
              <Input
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Label name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateLabel();
                  if (e.key === "Escape") {
                    setIsCreating(false);
                    setNewLabelName("");
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsCreating(false);
                    setNewLabelName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleCreateLabel}
                  disabled={createLabel.isPending}
                >
                  {createLabel.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Footer - Create Button */}
        {!isCreating && (
          <div className="border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setIsCreating(true)}
            >
              <Plus className="h-4 w-4" />
              Create new label
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
