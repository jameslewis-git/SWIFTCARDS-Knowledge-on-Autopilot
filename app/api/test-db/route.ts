import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("🔗 Testing Supabase connection...")
    
    // Test basic connection
    const { data, error } = await supabase
      .from('decks')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error("❌ Database connection failed:", error)
      return NextResponse.json({ 
        error: "Database connection failed", 
        details: error 
      }, { status: 500 })
    }
    
    console.log("✅ Database connection successful")
    
    return NextResponse.json({
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
      environment: {
        hasGoogleKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    })
  } catch (error) {
    console.error("💥 Database test error:", error)
    return NextResponse.json({ 
      error: "Database test failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 