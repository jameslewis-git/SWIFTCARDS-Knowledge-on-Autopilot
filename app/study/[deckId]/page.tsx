"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card as Flashcard, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, Eye, EyeOff, CheckCircle, XCircle, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

interface FlashcardType {
  id: number
  question: string
  answer: string
  difficulty: string
  reviewCount: number
  correctCount: number
}

interface DeckType {
  _id: string
  name: string
  description: string
  cards: FlashcardType[]
  tags: string[]
}

export default function StudyPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  const deckId = params.deckId as string

  const [deck, setDeck] = useState<DeckType | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyMode, setStudyMode] = useState<"flashcards" | "quiz">("flashcards")
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (deckId) {
      fetchDeck()
    }
  }, [deckId])

  const fetchDeck = async () => {
    try {
      const response = await fetch(`/api/decks/${deckId}`)
      if (response.ok) {
        const data = await response.json()
        setDeck(data.deck)
      } else {
        toast({
          title: "Error",
          description: "Failed to load deck",
          variant: "destructive",
        })
        router.push("/decks")
      }
    } catch (error) {
      console.error("Failed to fetch deck:", error)
      router.push("/decks")
    } finally {
      setLoading(false)
    }
  }

  const currentCard = deck?.cards[currentCardIndex]
  const progress = deck ? ((currentCardIndex + 1) / deck.cards.length) * 100 : 0

  const nextCard = () => {
    if (deck && currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowAnswer(false)
    }
  }

  const markAnswer = async (correct: boolean) => {
    if (!deck || !currentCard) return

    // Update session stats
    setSessionStats((prev) => ({
      ...prev,
      correct: correct ? prev.correct + 1 : prev.correct,
      incorrect: correct ? prev.incorrect : prev.incorrect + 1,
      total: prev.total + 1,
    }))

    // Update card stats in database
    try {
      await fetch(`/api/decks/${deckId}/cards/${currentCard.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correct }),
      })
    } catch (error) {
      console.error("Failed to update card stats:", error)
    }

    // Move to next card
    setTimeout(() => {
      if (currentCardIndex < deck.cards.length - 1) {
        nextCard()
      } else {
        // Session complete
        showSessionComplete()
      }
    }, 1000)
  }

  const showSessionComplete = () => {
    const accuracy = sessionStats.total > 0 ? (sessionStats.correct / sessionStats.total) * 100 : 0

    toast({
      title: "Study session complete! 🎉",
      description: `You got ${sessionStats.correct}/${sessionStats.total} correct (${accuracy.toFixed(1)}%)`,
    })
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  const resetSession = () => {
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setSessionStats({ correct: 0, incorrect: 0, total: 0 })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading deck...</p>
        </div>
      </div>
    )
  }

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Deck not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested deck could not be found.</p>
          <Button onClick={() => router.push("/decks")}>Back to Decks</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => router.push("/decks")} className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Decks
            </Button>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {currentCardIndex + 1} of {deck.cards.length}
              </Badge>
              {sessionStats.total > 0 && (
                <Badge variant="secondary">
                  {sessionStats.correct}/{sessionStats.total} correct
                </Badge>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">{deck.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{deck.description}</p>

          <Progress value={progress} className="h-2" />
        </motion.div>

        {/* Flashcard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard?.id}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.3 }}
            >
              <Flashcard
                className="min-h-[400px] cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setShowAnswer(!showAnswer)}
              >
                <CardContent className="flex items-center justify-center p-8 h-full">
                  <div className="text-center w-full">
                    {!showAnswer ? (
                      <div>
                        <div className="flex items-center justify-center mb-6">
                          <Badge variant="outline" className="px-4 py-2">
                            Question
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-semibold mb-6 leading-relaxed">{currentCard?.question}</h3>
                        <p className="text-gray-600 dark:text-gray-400">Click to reveal answer</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center mb-6">
                          <Badge variant="default" className="px-4 py-2">
                            Answer
                          </Badge>
                        </div>
                        <div className="text-lg leading-relaxed mb-8">{currentCard?.answer}</div>

                        {/* Answer Feedback Buttons */}
                        <div className="flex items-center justify-center space-x-4">
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAnswer(false)
                            }}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-5 w-5 mr-2" />
                            Incorrect
                          </Button>
                          <Button
                            size="lg"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAnswer(true)
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Correct
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Flashcard>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Controls */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={prevCard} disabled={currentCardIndex === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => speakText(showAnswer ? currentCard?.answer || "" : currentCard?.question || "")}
              >
                <Volume2 className="h-4 w-4" />
              </Button>

              <Button variant="outline" size="icon" onClick={resetSession}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" onClick={nextCard} disabled={!deck || currentCardIndex === deck.cards.length - 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Study Tips */}
          <Flashcard className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                <Star className="h-5 w-5 mr-2" />
                Study Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">🎯 Active Recall</h4>
                  <p className="text-gray-600 dark:text-gray-400">Try to answer before revealing the solution</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🔄 Spaced Repetition</h4>
                  <p className="text-gray-600 dark:text-gray-400">Review difficult cards more frequently</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📊 Track Progress</h4>
                  <p className="text-gray-600 dark:text-gray-400">Monitor your accuracy and improvement</p>
                </div>
              </div>
            </CardContent>
          </Flashcard>
        </div>
      </div>
    </div>
  )
}
