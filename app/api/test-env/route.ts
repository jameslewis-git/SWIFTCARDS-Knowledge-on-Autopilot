import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "API is working!",
    hasGoogleKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    googleKeyLength: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length || 0,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    timestamp: new Date().toISOString(),
  })
} 