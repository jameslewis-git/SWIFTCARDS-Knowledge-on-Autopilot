import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Deck } from "@/models/Deck"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ deckId: string }> }) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { deckId } = await params

    const deck = await Deck.findOne({
      _id: deckId,
      userId: user.id,
    })

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 })
    }

    return NextResponse.json({ deck })
  } catch (error) {
    console.error("Deck fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch deck" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ deckId: string }> }) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { deckId } = await params

    const deck = await Deck.findOneAndDelete({
      _id: deckId,
      userId: user.id,
    })

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deck deleted successfully" })
  } catch (error) {
    console.error("Deck deletion error:", error)
    return NextResponse.json({ error: "Failed to delete deck" }, { status: 500 })
  }
}
