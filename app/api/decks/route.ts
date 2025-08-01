import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Deck } from "@/models/Deck"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const decks = await Deck.find({ userId: user.id }).sort({ updatedAt: -1 }).select("-cards.answer") // Don't send answers in list view for security

    return NextResponse.json({ decks })
  } catch (error) {
    console.error("Decks fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch decks" }, { status: 500 })
  }
}
