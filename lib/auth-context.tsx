"use client"

import * as React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: "google" | "github") => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to transform Supabase user to our User type
function transformUser(supabaseUser: SupabaseUser | null): User | null {
  if (!supabaseUser) return null

  const metadata = supabaseUser.user_metadata || {}
  
  return {
    id: supabaseUser.id,
    name: metadata.name || metadata.full_name || supabaseUser.email?.split("@")[0] || "User",
    email: supabaseUser.email || "",
    avatar: metadata.avatar_url || metadata.picture || undefined,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser()

        setUser(transformUser(supabaseUser))
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(transformUser(session?.user ?? null))
      setIsLoading(false)
      // Refresh the router to update server components
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - supabase client is stable and we only want to set up listeners once

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setUser(transformUser(data.user))
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: name || email.split("@")[0],
          },
        },
      })

      if (error) throw error

      // If email confirmation is disabled in Supabase, user will be immediately available
      // Otherwise, we'll need to handle the confirmation flow
      if (data.user) {
        setUser(transformUser(data.user))
      }
    } catch (error) {
      console.error("Sign up failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithOAuth = async (provider: "google" | "github") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error(`OAuth sign in with ${provider} failed:`, error)
      throw error
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Sign out failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signInWithOAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

