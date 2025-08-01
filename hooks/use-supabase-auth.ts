"use client"

import { useContext } from "react"
import { AuthContext } from "@/components/supabase-auth-provider"

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider")
  }
  return context
} 