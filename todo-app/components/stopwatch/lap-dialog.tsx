"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Flag, Check } from "lucide-react";
import { useLabels } from "@/lib/hooks/use-labels";

interface LapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (labelId?: string) => Promise<void>;
  currentDuration: number;
  lapNumber: number;
}

export function LapDialog({
  open,
  onOpenChange,
  onSave,
  currentDuration,
  lapNumber,
}: LapDialogProps) {
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const { data: labels, isLoading: labelsLoading } = useLabels();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedLabel || undefined);
      onOpenChange(false);
      setSelectedLabel("");
    } catch (error) {
      console.error("Failed to save lap:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save lap:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            Lap {lapNumber}
          </DialogTitle>
          <DialogDescription>
            Duration: <span className="font-mono">{formatDuration(currentDuration)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Label Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Label (optional)
            </label>
            <Select value={selectedLabel} onValueChange={setSelectedLabel}>
              <SelectTrigger>
                <SelectValue placeholder="Select a label..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No label</SelectItem>
                {labelsLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  labels?.map((label) => (
                    <SelectItem key={label.id} value={label.id}>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        {label.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleQuickSave}
              variant="outline"
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Quick Save"
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Lap
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
