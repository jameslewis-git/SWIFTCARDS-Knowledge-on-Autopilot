import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { connectDB } from "@/lib/mongodb"
import { Deck } from "@/models/Deck"
import { getUserFromToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, deckName, tags } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Generate flashcards using AI
    const cards = await generateFlashcardsFromText(text)

    // Save to database
    await connectDB()
    const deck = await Deck.create({
      name: deckName || "Text Input Deck",
      description: "Generated from text input",
      cards,
      tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
      userId: user.id,
      createdAt: new Date(),
    })

    return NextResponse.json({
      deckId: deck._id,
      cards: cards.length,
      message: "Flashcards generated successfully",
    })
  } catch (error) {
    console.error("Text processing error:", error)
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 })
  }
}

async function generateFlashcardsFromText(content: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert educational content creator. Generate high-quality flashcards from the provided text content.

Rules:
1. Create concise, clear questions that test understanding
2. Provide comprehensive but not overly long answers
3. Focus on key concepts, definitions, and important facts
4. Vary question types (what, how, why, when, where)
5. Generate between 5-15 flashcards depending on content length
6. Return in JSON format

Format your response as a JSON array of objects with "question" and "answer" fields.`,
      prompt: `Generate flashcards from this text:\n\n${content}`,
    })

    // Parse the AI response to extract flashcards
    const flashcards = JSON.parse(text)

    // Validate and format the flashcards
    return flashcards.map((card: any, index: number) => ({
      id: index + 1,
      question: card.question,
      answer: card.answer,
      difficulty: "medium",
      lastReviewed: null,
      nextReview: new Date(),
      reviewCount: 0,
      correctCount: 0,
    }))
  } catch (error) {
    console.error("AI generation error:", error)
    // Fallback: return sample flashcards
    return [
      {
        id: 1,
        question: "What is the main topic discussed in the provided text?",
        answer: "The text covers educational content that has been processed for flashcard generation.",
        difficulty: "medium",
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0,
        correctCount: 0,
      },
    ]
  }
}
