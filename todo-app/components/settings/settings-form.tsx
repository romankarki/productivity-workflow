'use client'

import { useState } from 'react'
import { useUser, useUpdateUser } from '@/lib/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { User, Save, Loader2 } from 'lucide-react'

export function SettingsForm() {
  const { data: user } = useUser()
  const updateUser = useUpdateUser()
  const [username, setUsername] = useState(user?.username || '')
  const [hasChanges, setHasChanges] = useState(false)

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    setHasChanges(value !== user?.username)
  }

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error('Username cannot be empty')
      return
    }

    try {
      await updateUser.mutateAsync({ username: username.trim() })
      toast.success('Profile updated successfully')
      setHasChanges(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-zinc-100">Profile</CardTitle>
            <CardDescription className="text-zinc-400">
              Manage your account information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">Username</label>
          <div className="flex gap-3">
            <Input
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="Enter your username"
              className="bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
            <Button
              onClick={handleSave}
              disabled={!hasChanges || updateUser.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {updateUser.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="ml-2">Save</span>
            </Button>
          </div>
        </div>
        
        {user && (
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-lg font-medium text-white">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-zinc-100 font-medium">{user.username}</p>
                <p className="text-xs">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
