import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    message: "Hello from SWIFTCARDS API!",
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      hasGoogleKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  })
} 