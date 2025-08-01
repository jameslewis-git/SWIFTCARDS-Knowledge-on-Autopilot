import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface Deck {
  id: string
  name: string
  description: string
  user_id: string
  cards: any[]
  tags: string[]
  created_at: string
  updated_at: string
  stats: {
    total_views: number
    total_study_sessions: number
    average_score: number
  }
}

export interface Card {
  id: string
  deck_id: string
  front: string
  back: string
  created_at: string
  updated_at: string
} 