import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Deck } from "@/models/Deck"
import { getUserFromToken } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ deckId: string; cardId: string }> }) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { correct } = await request.json()

    await connectDB()
    const { deckId, cardId } = await params

    const deck = await Deck.findOne({
      _id: deckId,
      userId: user.id,
    })

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 })
    }

    // Find and update the specific card
    const cardIndex = deck.cards.findIndex((card) => card.id === Number.parseInt(cardId))

    if (cardIndex === -1) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    // Update card statistics
    deck.cards[cardIndex].reviewCount += 1
    deck.cards[cardIndex].lastReviewed = new Date()

    if (correct) {
      deck.cards[cardIndex].correctCount += 1
    }

    // Calculate next review date based on spaced repetition
    const accuracy = deck.cards[cardIndex].correctCount / deck.cards[cardIndex].reviewCount
    const interval = correct ? Math.max(1, Math.floor(accuracy * 7)) : 1 // 1-7 days based on accuracy

    deck.cards[cardIndex].nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000)

    await deck.save()

    return NextResponse.json({
      message: "Card review recorded",
      card: deck.cards[cardIndex],
    })
  } catch (error) {
    console.error("Card review error:", error)
    return NextResponse.json({ error: "Failed to record review" }, { status: 500 })
  }
}
