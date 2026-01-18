'use client'

import { useQuery } from '@tanstack/react-query'
import { 
  WeeklyAnalytics, 
  MonthlyAnalytics, 
  LabelAnalytics,
  DateRangeOption 
} from '@/lib/types/analytics'
import { getUserId } from './use-user'
import { format, subDays, subWeeks, startOfMonth, subMonths } from 'date-fns'

// Helper function to calculate date params based on range option
function getDateParams(range: DateRangeOption): { startDate?: string; month?: string } {
  const today = new Date()
  
  switch (range) {
    case 'this-week':
      return { startDate: format(subDays(today, 6), 'yyyy-MM-dd') }
    case 'last-week':
      return { startDate: format(subDays(subWeeks(today, 1), 6), 'yyyy-MM-dd') }
    case 'this-month':
      return { month: format(today, 'yyyy-MM') }
    case 'last-month':
      return { month: format(subMonths(startOfMonth(today), 1), 'yyyy-MM') }
    default:
      return { startDate: format(subDays(today, 6), 'yyyy-MM-dd') }
  }
}

// Fetch weekly analytics
async function fetchWeeklyAnalytics(startDate?: string): Promise<WeeklyAnalytics | null> {
  const userId = getUserId()
  if (!userId) return null
  
  const params = new URLSearchParams({ userId })
  if (startDate) params.append('startDate', startDate)
  
  const response = await fetch(`/api/analytics/week?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch weekly analytics')
  }
  
  return response.json()
}

// Fetch monthly analytics
async function fetchMonthlyAnalytics(month?: string): Promise<MonthlyAnalytics | null> {
  const userId = getUserId()
  if (!userId) return null
  
  const params = new URLSearchParams({ userId })
  if (month) params.append('month', month)
  
  const response = await fetch(`/api/analytics/month?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch monthly analytics')
  }
  
  return response.json()
}

// Fetch label analytics
async function fetchLabelAnalytics(period: 'week' | 'month'): Promise<LabelAnalytics | null> {
  const userId = getUserId()
  if (!userId) return null
  
  const params = new URLSearchParams({ userId, period })
  
  const response = await fetch(`/api/analytics/labels?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch label analytics')
  }
  
  return response.json()
}

// Hook for weekly analytics
export function useWeeklyAnalytics(startDate?: string) {
  const userId = getUserId()
  
  return useQuery({
    queryKey: ['analytics', 'week', startDate, userId],
    queryFn: () => fetchWeeklyAnalytics(startDate),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for monthly analytics
export function useMonthlyAnalytics(month?: string) {
  const userId = getUserId()
  
  return useQuery({
    queryKey: ['analytics', 'month', month, userId],
    queryFn: () => fetchMonthlyAnalytics(month),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook for label analytics
export function useLabelAnalytics(period: 'week' | 'month') {
  const userId = getUserId()
  
  return useQuery({
    queryKey: ['analytics', 'labels', period, userId],
    queryFn: () => fetchLabelAnalytics(period),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

// Combined hook for analytics based on date range
export function useAnalytics(dateRange: DateRangeOption) {
  const userId = getUserId()
  const params = getDateParams(dateRange)
  const isWeekly = dateRange === 'this-week' || dateRange === 'last-week'
  const period = isWeekly ? 'week' : 'month'
  
  const weeklyQuery = useQuery({
    queryKey: ['analytics', 'week', params.startDate, userId],
    queryFn: () => fetchWeeklyAnalytics(params.startDate),
    enabled: !!userId && isWeekly,
    staleTime: 5 * 60 * 1000,
  })
  
  const monthlyQuery = useQuery({
    queryKey: ['analytics', 'month', params.month, userId],
    queryFn: () => fetchMonthlyAnalytics(params.month),
    enabled: !!userId && !isWeekly,
    staleTime: 5 * 60 * 1000,
  })
  
  const labelQuery = useQuery({
    queryKey: ['analytics', 'labels', period, userId],
    queryFn: () => fetchLabelAnalytics(period),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
  
  return {
    // Return the appropriate data based on range type
    timeData: isWeekly ? weeklyQuery.data : monthlyQuery.data,
    labelData: labelQuery.data,
    isLoading: (isWeekly ? weeklyQuery.isLoading : monthlyQuery.isLoading) || labelQuery.isLoading,
    error: weeklyQuery.error || monthlyQuery.error || labelQuery.error,
    isWeekly,
  }
}
