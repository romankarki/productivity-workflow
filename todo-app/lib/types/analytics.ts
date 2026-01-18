export interface DailyStats {
  date: string
  totalTime: number // milliseconds
  taskCount: number
  completedCount: number
  labelBreakdown: LabelTimeBreakdown[]
}

export interface LabelTimeBreakdown {
  labelId: string
  labelName: string
  labelColor: string
  time: number // milliseconds
}

export interface WeeklyAnalytics {
  days: DailyStats[]
  totalTime: number
  averageDaily: number
  mostProductiveDay: string | null
  taskCompletion: {
    total: number
    completed: number
    rate: number
  }
}

export interface MonthlyAnalytics {
  days: DailyStats[]
  totalTime: number
  averageDaily: number
  mostProductiveDay: string | null
  taskCompletion: {
    total: number
    completed: number
    rate: number
  }
}

export interface LabelAnalyticsItem {
  id: string
  name: string
  color: string
  totalTime: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

export interface LabelAnalytics {
  labels: LabelAnalyticsItem[]
  totalTrackedTime: number
}

export type DateRangeOption = 'this-week' | 'last-week' | 'this-month' | 'last-month'
