import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  console.log("🚀 Test upload API called")
  
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    console.log("🔑 Auth header:", authHeader ? "Present" : "Missing")
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ Unauthorized - No valid auth header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    console.log("🔑 Token length:", token.length)
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    console.log("👤 User verification:", user ? "Success" : "Failed", error)
    
    if (error || !user) {
      console.log("❌ User verification failed:", error)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("✅ User authenticated:", user.email)

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

    // Check file size (Netlify limit: 50MB)
    if (file.size > 50 * 1024 * 1024) {
      console.log("❌ File too large:", file.size)
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 })
    }

    console.log("✅ File validation passed")

    // Test database connection
    console.log("💾 Testing database connection...")
    const { data: testDeck, error: testError } = await supabase
      .from('decks')
      .insert({
        name: "Test Deck - " + new Date().toISOString(),
        description: "Test deck for debugging",
        tags: ["test"],
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (testError) {
      console.error("❌ Database test failed:", testError)
      return NextResponse.json({ error: "Database connection failed", details: testError }, { status: 500 })
    }

    console.log("✅ Database test successful:", testDeck.id)

    // Clean up test deck
    await supabase.from('decks').delete().eq('id', testDeck.id)

    return NextResponse.json({
      message: "Upload test successful",
      user: user.email,
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      },
      database: "Connected successfully"
    })
  } catch (error) {
    console.error("💥 Test upload error:", error)
    return NextResponse.json({ 
      error: "Test upload failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 