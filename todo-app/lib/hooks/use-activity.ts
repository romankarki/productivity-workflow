'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserId } from './use-user'

export interface ActivityTaskLabel {
  id: string
  name: string
  color: string
}

export interface ActivityTask {
  id: string
  title: string
  completed: boolean
  labels: ActivityTaskLabel[]
  totalTimeTracked: number
}

export interface ActivityDay {
  date: string
  tasks: ActivityTask[]
  notes: string | null
  dailyWins: string | null
  totalTime: number
  completedCount: number
  taskCount: number
}

async function fetchRecentActivity(): Promise<ActivityDay[]> {
  const userId = getUserId()
  if (!userId) return []

  const response = await fetch('/api/activity/recent', {
    headers: { 'x-user-id': userId },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch recent activity')
  }

  const json = await response.json()
  return json.data
}

export function useRecentActivity() {
  const userId = getUserId()

  return useQuery({
    queryKey: ['activity', 'recent', userId],
    queryFn: fetchRecentActivity,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}
