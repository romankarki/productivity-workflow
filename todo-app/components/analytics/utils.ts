// Format duration from milliseconds to human-readable string
export function formatDuration(ms: number): string {
  if (ms === 0) return '0m'
  
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
  
  return `${minutes}m`
}

// Format duration to hours with decimals
export function formatHours(ms: number): string {
  const hours = ms / (1000 * 60 * 60)
  
  if (hours === 0) return '0h'
  if (hours < 1) return `${Math.round(hours * 60)}m`
  
  return `${hours.toFixed(1)}h`
}

// Convert milliseconds to hours for chart display
export function msToHours(ms: number): number {
  return ms / (1000 * 60 * 60)
}

// Get day name from date string
export function getDayName(dateStr: string, short: boolean = true): string {
  const date = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = { weekday: short ? 'short' : 'long' }
  return date.toLocaleDateString('en-US', options)
}

// Format date for display
export function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Generate color variants for charts
export function getChartColors(): string[] {
  return [
    '#10b981', // emerald-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#f59e0b', // amber-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#ef4444', // red-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
    '#6366f1', // indigo-500
  ]
}
