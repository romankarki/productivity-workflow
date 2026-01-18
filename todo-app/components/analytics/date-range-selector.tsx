'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangeOption } from '@/lib/types/analytics'

interface DateRangeSelectorProps {
  value: DateRangeOption
  onChange: (value: DateRangeOption) => void
}

const options: { value: DateRangeOption; label: string }[] = [
  { value: 'this-week', label: 'This Week' },
  { value: 'last-week', label: 'Last Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
]

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] bg-zinc-800/50 border-zinc-700 text-zinc-100">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-800 border-zinc-700">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
