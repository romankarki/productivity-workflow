"use client";

import { Label } from "@/lib/types/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Tag } from "lucide-react";

interface LabelCardProps {
  label: Label;
  taskCount?: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function LabelCard({ label, taskCount = 0, onEdit, onDelete }: LabelCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `${label.color}20` }}
        >
          <Tag className="h-5 w-5" style={{ color: label.color }} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: label.color }}
            />
            <span className="font-medium">{label.name}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {taskCount} task{taskCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
