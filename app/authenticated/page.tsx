'use client'

import { redirect } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useEffect } from 'react'

export default function AuthenticatedPage() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      redirect('/auth/login')
    } else if (!isLoading && user) {
      redirect('/dashboard')
    }
  }, [user, isLoading])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
