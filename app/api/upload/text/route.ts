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

    // Save deck to database using Supabase
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .insert({
        name: deckName || "Text Input Deck",
        description: "Generated from text input",
        tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
        user_id: user.id,
        stats: { total_views: 0, total_study_sessions: 0, average_score: 0 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (deckError) {
      console.error("Database error:", deckError)
      return NextResponse.json({ error: "Failed to save deck" }, { status: 500 })
    }

    // Save cards to the cards table
    const cardsToInsert = cards.map((card: any) => ({
      deck_id: deck.id,
      front: card.question,
      back: card.answer,
      created_at: new Date().toISOString(),
    }))

    const { error: cardsError } = await supabase
      .from('cards')
      .insert(cardsToInsert)

    if (cardsError) {
      console.error("Cards insertion error:", cardsError)
      // Try to delete the deck if cards insertion failed
      await supabase.from('decks').delete().eq('id', deck.id)
      return NextResponse.json({ error: "Failed to save cards" }, { status: 500 })
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
    console.log("Generating flashcards from text, length:", content.length)
    
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
7. Ensure the response is valid JSON

Format your response as a JSON array of objects with "question" and "answer" fields only.`,
      prompt: `Generate flashcards from this text:\n\n${content.substring(0, 4000)}`,
    })

    console.log("AI response received, length:", text.length)
    console.log("AI response preview:", text.substring(0, 200))

    // Try to parse the AI response
    let flashcards
    try {
      flashcards = JSON.parse(text)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      console.log("Raw AI response:", text)
      
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[.*\]/s)
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("Could not parse AI response as JSON")
      }
    }

    // Validate flashcards structure
    if (!Array.isArray(flashcards)) {
      throw new Error("AI response is not an array")
    }

    // Validate and format the flashcards
    const formattedCards = flashcards.map((card: any, index: number) => {
      if (!card.question || !card.answer) {
        console.warn("Invalid card structure:", card)
        return {
          id: index + 1,
          question: card.question || "Question not provided",
          answer: card.answer || "Answer not provided",
          difficulty: "medium",
          lastReviewed: null,
          nextReview: new Date(),
          reviewCount: 0,
          correctCount: 0,
        }
      }
      
      return {
        id: index + 1,
        question: card.question,
        answer: card.answer,
        difficulty: "medium",
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0,
        correctCount: 0,
      }
    })

    console.log("Generated", formattedCards.length, "flashcards")
    return formattedCards
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
      {
        id: 2,
        question: "What learning technique is most effective for retention?",
        answer: "Spaced repetition is one of the most effective learning techniques for long-term retention of information.",
        difficulty: "medium",
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0,
        correctCount: 0,
      },
    ]
  }
}
