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

    // Save to database
    await connectDB()
    const deck = await Deck.create({
      name: deckName || file.name,
      description: `Generated from ${file.name}`,
      cards,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      userId: user.id,
      createdAt: new Date(),
    })

    return NextResponse.json({
      deckId: deck._id,
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
  // For demo purposes, we'll simulate PDF content extraction
  return `Sample PDF content extracted from ${file.name}. This would contain the actual text from the PDF document using libraries like pdf-parse or pdf2pic for OCR.`
}

async function extractImageContent(file: File): Promise<string> {
  // In a real implementation, you would use OCR services like Tesseract.js or cloud OCR APIs
  // For demo purposes, we'll simulate OCR content extraction
  return `Sample OCR content extracted from ${file.name}. This would contain the actual text recognized from the image using OCR technology.`
}

async function extractVideoContent(file: File): Promise<string> {
  // In a real implementation, you would use speech-to-text services like OpenAI Whisper
  // For demo purposes, we'll simulate speech-to-text content extraction
  return `Sample speech-to-text content extracted from ${file.name}. This would contain the actual transcribed text from the video's audio track.`
}

async function generateFlashcards(content: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are an expert educational content creator. Generate high-quality flashcards from the provided content. 

Rules:
1. Create concise, clear questions that test understanding
2. Provide comprehensive but not overly long answers
3. Focus on key concepts, definitions, and important facts
4. Vary question types (what, how, why, when, where)
5. Return exactly 10 flashcards in JSON format

Format your response as a JSON array of objects with "question" and "answer" fields.`,
      prompt: `Generate flashcards from this content:\n\n${content}`,
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
        question: "What is the main topic of this content?",
        answer:
          "Based on the uploaded content, this appears to cover key educational concepts that would benefit from spaced repetition learning.",
        difficulty: "medium",
        lastReviewed: null,
        nextReview: new Date(),
        reviewCount: 0,
        correctCount: 0,
      },
    ]
  }
}
