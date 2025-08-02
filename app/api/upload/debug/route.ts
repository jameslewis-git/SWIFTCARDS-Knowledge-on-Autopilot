import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  return NextResponse.json({
    message: "Upload debug API is working!",
    timestamp: new Date().toISOString(),
    environment: {
      hasGoogleKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  })
}

export async function POST(request: any) {
  console.log("🚀 Debug upload API called")
  
  try {
    // Test basic request handling
    console.log("📝 Request method:", request.method)
    console.log("📝 Request headers:", Object.fromEntries(request.headers.entries()))
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    console.log("🔑 Auth header:", authHeader ? "Present" : "Missing")
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ Unauthorized - No valid auth header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    console.log("🔑 Token length:", token.length)
    
    // Test Supabase connection
    console.log("🔗 Testing Supabase connection...")
    const { data: { user }, error } = await supabase.auth.getUser(token)
    console.log("👤 User verification:", user ? "Success" : "Failed", error)
    
    if (error || !user) {
      console.log("❌ User verification failed:", error)
      return NextResponse.json({ error: "Unauthorized", details: error }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.email)

    // Test form data parsing
    console.log("📄 Parsing form data...")
    const formData = await request.formData()
    const file = formData.get("file") as File
    const deckName = formData.get("deckName") as string
    const tags = formData.get("tags") as string

    console.log("📁 File received:", file?.name, file?.size, file?.type)
    console.log("📝 Deck name:", deckName)
    console.log("🏷️ Tags:", tags)

    if (!file) {
      console.log("❌ No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    return NextResponse.json({
      message: "Debug upload successful",
      user: user.email,
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("💥 Debug upload error:", error)
    return NextResponse.json({ 
      error: "Debug upload failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 