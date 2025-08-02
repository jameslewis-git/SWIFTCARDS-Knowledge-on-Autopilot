import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch decks for the user
    const { data: decks, error: decksError } = await supabase
      .from('decks')
      .select(`
        id,
        name,
        description,
        tags,
        created_at,
        updated_at,
        stats,
        cards (
          id,
          front
        )
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (decksError) {
      console.error("Database error:", decksError)
      return NextResponse.json({ error: "Failed to fetch decks" }, { status: 500 })
    }

    return NextResponse.json({ decks: decks || [] })
  } catch (error) {
    console.error("Decks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch decks" }, { status: 500 })
  }
}
