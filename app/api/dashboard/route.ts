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

    // Get user's decks
    const decks = await Deck.find({ userId: user.id }).sort({ createdAt: -1 })

    // Calculate stats
    const totalDecks = decks.length
    const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0)

    // Calculate studied today (mock data for demo)
    const studiedToday = Math.floor(Math.random() * 50) + 10

    // Calculate streak (mock data for demo)
    const streak = Math.floor(Math.random() * 30) + 1

    // Get recent decks (last 5)
    const recentDecks = decks.slice(0, 5).map((deck) => ({
      id: deck._id,
      name: deck.name,
      description: deck.description,
      cardCount: deck.cards.length,
      tags: deck.tags,
      createdAt: deck.createdAt,
    }))

    return NextResponse.json({
      stats: {
        totalDecks,
        totalCards,
        studiedToday,
        streak,
      },
      recentDecks,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
