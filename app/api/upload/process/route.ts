import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { supabase } from "@/lib/supabase"
import { createClient } from "@supabase/supabase-js"

// Create a service role client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  console.log("🚀 Upload API called")
  
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    console.log("🔑 Auth header:", authHeader ? "Present" : "Missing")
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ Unauthorized - No valid auth header")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Extract content based on file type
    let extractedContent = ""

    if (file.type === "application/pdf") {
      extractedContent = await extractPDFContent(file)
    } else if (file.type.startsWith("image/")) {
      extractedContent = await extractImageContent(file)
    } else if (file.type.startsWith("video/")) {
      extractedContent = await extractVideoContent(file)
    } else if (file.type.startsWith("text/")) {
      extractedContent = await file.text()
    } else {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    // Generate flashcards using AI
    const cards = await generateFlashcards(extractedContent)

    // Save deck to database using Supabase
    const { data: deck, error: deckError } = await supabaseAdmin
      .from('decks')
      .insert({
        name: deckName || file.name,
        description: `Generated from ${file.name}`,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
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

    const { error: cardsError } = await supabaseAdmin
      .from('cards')
      .insert(cardsToInsert)

    if (cardsError) {
      console.error("Cards insertion error:", cardsError)
      // Try to delete the deck if cards insertion failed
      await supabaseAdmin.from('decks').delete().eq('id', deck.id)
      return NextResponse.json({ error: "Failed to save cards" }, { status: 500 })
    }

    return NextResponse.json({
      deckId: deck.id,
      cards: cards.length,
      message: "Flashcards generated successfully",
    })
  } catch (error) {
    console.error("Upload processing error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}

async function extractPDFContent(file: File): Promise<string> {
  // In a real implementation, you would use a PDF parsing library like pdf-parse
  // For demo purposes, we'll simulate PDF content extraction with educational content
  return `Educational content extracted from ${file.name}. 

This document appears to cover important academic concepts including:

1. **Learning Theories**: The document discusses various learning theories including behaviorism, cognitivism, and constructivism. These theories explain how people acquire knowledge and skills.

2. **Memory and Retention**: The content explores how memory works, including short-term and long-term memory processes. It covers techniques for improving retention such as spaced repetition and active recall.

3. **Study Methods**: The document outlines effective study strategies including the Pomodoro Technique, mind mapping, and the Feynman Technique for understanding complex topics.

4. **Cognitive Load Theory**: This theory explains how the brain processes information and how to optimize learning by managing cognitive load effectively.

5. **Metacognition**: The content discusses thinking about thinking, including self-awareness of learning processes and strategies for monitoring comprehension.

This educational material provides a comprehensive foundation for understanding effective learning strategies and cognitive processes.`
}

async function extractImageContent(file: File): Promise<string> {
  // In a real implementation, you would use OCR services like Tesseract.js or cloud OCR APIs
  // For demo purposes, we'll simulate OCR content extraction with educational content
  return `Text content extracted from ${file.name} using OCR technology.

The image contains educational information about:

**Learning Principles**:
- Active learning is more effective than passive learning
- Spaced repetition improves long-term retention
- Interleaving different topics enhances learning
- Testing yourself strengthens memory

**Study Techniques**:
- Use flashcards for active recall
- Practice with different question types
- Review material at increasing intervals
- Connect new information to existing knowledge

**Memory Strategies**:
- Chunking information into smaller pieces
- Using mnemonic devices
- Creating visual associations
- Teaching others to reinforce learning

This content provides practical strategies for effective studying and knowledge retention.`
}

async function extractVideoContent(file: File): Promise<string> {
  // In a real implementation, you would use speech-to-text services like OpenAI Whisper
  // For demo purposes, we'll simulate speech-to-text content extraction with educational content
  return `Audio content transcribed from ${file.name} using speech-to-text technology.

The video discusses educational concepts including:

**Effective Learning Methods**:
The speaker explains that effective learning involves more than just reading and memorizing. It requires active engagement with the material through techniques like self-testing, spaced repetition, and elaborative interrogation.

**Cognitive Science of Learning**:
The content covers how the brain processes and stores information, including the role of working memory, long-term memory, and the importance of retrieval practice in strengthening neural connections.

**Study Strategies**:
The video outlines several evidence-based study strategies including the Leitner system for flashcards, the Cornell note-taking method, and the importance of varying study contexts and conditions.

**Motivation and Learning**:
The speaker discusses intrinsic versus extrinsic motivation and how setting specific, achievable goals can enhance learning outcomes and persistence.

This educational content provides a scientific approach to improving learning effectiveness and academic performance.`
}

async function generateFlashcards(content: string) {
  try {
    console.log("Generating flashcards for content length:", content.length)
    
    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are an expert educational content creator. Generate high-quality flashcards from the provided content. 

Rules:
1. Create concise, clear questions that test understanding
2. Provide comprehensive but not overly long answers
3. Focus on key concepts, definitions, and important facts
4. Vary question types (what, how, why, when, where)
5. Return exactly 10 flashcards in JSON format
6. Ensure the response is valid JSON

Format your response as a JSON array of objects with "question" and "answer" fields only.`,
      prompt: `Generate flashcards from this content:\n\n${content.substring(0, 4000)}`,
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
      
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\s*(\[.*?\])\s*```/s)
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[1])
      } else {
        // Try to extract JSON from the response without markdown
        const arrayMatch = text.match(/\[.*\]/s)
        if (arrayMatch) {
          flashcards = JSON.parse(arrayMatch[0])
        } else {
          throw new Error("Could not parse AI response as JSON")
        }
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
        question: "What is the main topic of this content?",
        answer: "Based on the uploaded content, this appears to cover key educational concepts that would benefit from spaced repetition learning.",
        difficulty: "medium",
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0,
        correctCount: 0,
      },
      {
        id: 2,
        question: "What learning technique does this content support?",
        answer: "This content supports spaced repetition learning, which helps improve long-term retention of information.",
        difficulty: "medium",
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0,
        correctCount: 0,
      },
    ]
  }
}
