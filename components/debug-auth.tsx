"use client"

import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { useEffect } from "react"

export function DebugAuth() {
  const { user, loading } = useSupabaseAuth()

  useEffect(() => {
    console.log("Auth Debug:", { user, loading })
  }, [user, loading])

  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
        <div>Loading: {loading ? "true" : "false"}</div>
        <div>User: {user ? "logged in" : "not logged in"}</div>
        {user && (
          <div>Name: {user.name}</div>
        )}
      </div>
    )
  }

  return null
} 