"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";

const PRESET_COLORS = [
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#a855f7", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#6b7280", // Gray
  "#78716c", // Stone
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value);

  return (
    <div className="space-y-3">
      {/* Preset Colors */}
      <div className="grid grid-cols-7 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
              "hover:scale-110 hover:ring-2 hover:ring-offset-2 hover:ring-offset-background",
              value === color && "ring-2 ring-offset-2 ring-offset-background"
            )}
            style={{ 
              backgroundColor: color,
              // Use CSS custom property for ring color
              ['--tw-ring-color' as string]: color,
            } as React.CSSProperties}
          >
            {value === color && (
              <Check className="h-4 w-4 text-white drop-shadow" strokeWidth={3} />
            )}
          </button>
        ))}
      </div>

      {/* Custom Color Input */}
      <div className="flex items-center gap-3">
        <div
          className="h-8 w-8 rounded-full border border-border"
          style={{ backgroundColor: isValidHex ? value : "#6b7280" }}
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 font-mono text-sm"
          maxLength={7}
        />
      </div>
    </div>
  );
}

export { PRESET_COLORS };
