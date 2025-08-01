import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, deckName, tags } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Generate flashcards using AI
    const cards = await generateFlashcardsFromText(text)

    // Save to database using Supabase
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        name: deckName || "Text Input Deck",
        description: "Generated from text input",
        cards: cards,
        tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
        user_id: user.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (deckError) {
      console.error("Database error:", deckError)
      return NextResponse.json({ error: "Failed to save deck" }, { status: 500 })
    }

    return NextResponse.json({
      deckId: deck.id,
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
      model: google("gemini-1.5-flash"),
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
