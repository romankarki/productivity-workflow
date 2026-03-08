'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { SettingsForm } from '@/components/settings/settings-form'
import { ThemeSelector } from '@/components/settings/theme-selector'
import { IntegrationsForm } from '@/components/settings/integrations-form'
import { DangerZone } from '@/components/settings/danger-zone'
import { Settings, Loader2 } from 'lucide-react'
import { useUser } from '@/lib/hooks/use-user'
import { Skeleton } from '@/components/ui/skeleton'

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const { data: user, isLoading } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3 mb-8">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div>
                <Skeleton className="h-7 w-24 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[120px] w-full rounded-xl" />
              <Skeleton className="h-[160px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12">
              <p className="text-zinc-400">Please create an account first</p>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-600 to-zinc-700 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
              <p className="text-sm text-zinc-400">Manage your account and preferences</p>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            <SettingsForm />
            <IntegrationsForm />
            <ThemeSelector />
            <DangerZone />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
