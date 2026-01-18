"use client";

import { useLabels } from "@/lib/hooks/use-labels";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X, Filter } from "lucide-react";

interface LabelFilterProps {
  selectedLabelIds: string[];
  onToggle: (labelId: string) => void;
  onClear: () => void;
}

export function LabelFilter({
  selectedLabelIds,
  onToggle,
  onClear,
}: LabelFilterProps) {
  const { data: labels } = useLabels();

  if (!labels || labels.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
      
      <ScrollArea className="flex-1">
        <div className="flex items-center gap-2 pb-2">
          {/* All Button */}
          <Button
            variant={selectedLabelIds.length === 0 ? "default" : "outline"}
            size="sm"
            onClick={onClear}
            className="shrink-0"
          >
            All
          </Button>

          {/* Label Filters */}
          {labels.map((label) => {
            const isSelected = selectedLabelIds.includes(label.id);
            return (
              <Button
                key={label.id}
                variant="outline"
                size="sm"
                onClick={() => onToggle(label.id)}
                className={cn(
                  "shrink-0 gap-1.5",
                  isSelected && "border-2"
                )}
                style={{
                  borderColor: isSelected ? label.color : undefined,
                  backgroundColor: isSelected ? `${label.color}10` : undefined,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                {label.name}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Clear Filters */}
      {selectedLabelIds.length > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-8 w-8 shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
