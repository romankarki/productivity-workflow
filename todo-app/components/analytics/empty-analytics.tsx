'use client'

import { BarChart3, Clock, Tag, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyAnalyticsProps {
  type: 'no-time' | 'no-tasks' | 'no-labels'
}

export function EmptyAnalytics({ type }: EmptyAnalyticsProps) {
  const content = {
    'no-time': {
      icon: <Clock className="w-12 h-12" />,
      title: 'No time tracked yet',
      description: 'Start a stopwatch on any task to see your productivity insights here.',
      action: {
        label: 'Go to Today',
        href: `/day/${new Date().toISOString().split('T')[0]}`,
      },
    },
    'no-tasks': {
      icon: <Target className="w-12 h-12" />,
      title: 'No tasks created',
      description: 'Create some tasks to start tracking your productivity.',
      action: {
        label: 'Create Tasks',
        href: `/day/${new Date().toISOString().split('T')[0]}`,
      },
    },
    'no-labels': {
      icon: <Tag className="w-12 h-12" />,
      title: 'No labels yet',
      description: 'Create labels to categorize your time and get detailed insights.',
      action: {
        label: 'Manage Labels',
        href: '/labels',
      },
    },
  }

  const { icon, title, description, action } = content[type]

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6 text-zinc-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 max-w-md mb-6">{description}</p>
      <Link href={action.href}>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          {action.label}
        </Button>
      </Link>
    </div>
  )
}

export function EmptyAnalyticsCard({ 
  title, 
  description,
  icon: Icon = BarChart3 
}: { 
  title: string
  description: string
  icon?: React.ElementType
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <Icon className="w-10 h-10 text-zinc-600 mb-4" />
      <p className="text-zinc-400 text-lg mb-1">{title}</p>
      <p className="text-zinc-500 text-sm">{description}</p>
    </div>
  )
}
