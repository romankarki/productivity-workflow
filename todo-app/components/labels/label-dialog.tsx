"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker, PRESET_COLORS } from "./color-picker";
import { Label } from "@/lib/types/label";
import { useCreateLabel, useUpdateLabel } from "@/lib/hooks/use-labels";
import { Loader2, Tag } from "lucide-react";
import { toast } from "sonner";

interface LabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label?: Label; // If provided, edit mode
}

export function LabelDialog({ open, onOpenChange, label }: LabelDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();

  const isEditing = !!label;
  const isPending = createLabel.isPending || updateLabel.isPending;

  useEffect(() => {
    if (open) {
      if (label) {
        setName(label.name);
        setColor(label.color);
      } else {
        setName("");
        setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
      }
    }
  }, [open, label]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Label name is required");
      return;
    }

    try {
      if (isEditing) {
        await updateLabel.mutateAsync({
          id: label.id,
          data: { name: name.trim(), color },
        });
        toast.success("Label updated");
      } else {
        await createLabel.mutateAsync({
          name: name.trim(),
          color,
        });
        toast.success("Label created");
      }
      onOpenChange(false);
    } catch {
      toast.error(isEditing ? "Failed to update label" : "Failed to create label");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Label" : "Create Label"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your label's name and color."
              : "Create a new label to organize your tasks."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Preview */}
          <div className="flex items-center justify-center">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: color }}
            >
              <Tag className="h-3.5 w-3.5" />
              {name || "Label Name"}
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Work, Personal, Urgent"
              autoFocus
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Label"
              ) : (
                "Create Label"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
