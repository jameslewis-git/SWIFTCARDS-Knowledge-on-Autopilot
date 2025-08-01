import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { connectDB } from "@/lib/mongodb"
import { Deck } from "@/models/Deck"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "mixed"

    await connectDB()

    // Get user's decks
    const decks = await Deck.find({ userId: user.id })

    if (decks.length === 0) {
      return NextResponse.json({ error: "No decks found" }, { status: 404 })
    }

    // Collect cards based on quiz type
    let selectedCards: any[] = []

    switch (type) {
      case "recent":
        // Cards studied in the last 7 days
        selectedCards = decks.flatMap((deck) =>
          deck.cards
            .filter(
              (card) =>
                card.lastReviewed && new Date(card.lastReviewed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            )
            .map((card) => ({ ...card, deckName: deck.name })),
        )
        break

      case "difficult":
        // Cards with low accuracy (< 60%)
        selectedCards = decks.flatMap((deck) =>
          deck.cards
            .filter((card) => card.reviewCount > 0 && card.correctCount / card.reviewCount < 0.6)
            .map((card) => ({ ...card, deckName: deck.name })),
        )
        break

      default: // mixed
        selectedCards = decks.flatMap((deck) => deck.cards.map((card) => ({ ...card, deckName: deck.name })))
    }

    // Shuffle and limit to 10 questions
    const shuffled = selectedCards.sort(() => 0.5 - Math.random())
    const quizCards = shuffled.slice(0, Math.min(10, shuffled.length))

    // Generate quiz questions using AI
    const questions = await Promise.all(
      quizCards.map(async (card, index) => {
        try {
          const { text } = await generateText({
            model: google("gemini-1.5-flash"),
            system: `You are a quiz generator. Create a quiz question based on the provided flashcard content. 

Generate either:
1. Multiple choice with 4 options (mark correct answer)
2. Fill-in-the-blank
3. True/false

Return JSON format:
{
  "question": "question text",
  "type": "multiple-choice|fill-in-blank|true-false",
  "correctAnswer": "correct answer",
  "options": ["option1", "option2", "option3", "option4"] // only for multiple-choice
}`,
            prompt: `Flashcard Question: ${card.question}\nFlashcard Answer: ${card.answer}`,
          })

          const quizData = JSON.parse(text)

          return {
            id: index + 1,
            question: quizData.question,
            correctAnswer: quizData.correctAnswer,
            options: quizData.options,
            type: quizData.type,
            deckName: card.deckName,
            difficulty: card.difficulty || "medium",
          }
        } catch (error) {
          console.error("Failed to generate quiz question:", error)
          // Fallback to original flashcard
          return {
            id: index + 1,
            question: card.question,
            correctAnswer: card.answer,
            type: "fill-in-blank",
            deckName: card.deckName,
            difficulty: card.difficulty || "medium",
          }
        }
      }),
    )

    return NextResponse.json({ questions })
  } catch (error) {
    console.error("Quiz generation error:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
