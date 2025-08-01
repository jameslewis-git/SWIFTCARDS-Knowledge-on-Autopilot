"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, BookOpen, Trophy, Play, RotateCcw, ChevronLeft, ChevronRight, Volume2, Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Sample demo data
const demoDecks = [
  {
    id: 1,
    name: "Biology Basics",
    description: "Fundamental concepts in biology",
    cardCount: 15,
    tags: ["Science", "Biology"],
    cards: [
      {
        id: 1,
        question: "What is photosynthesis?",
        answer:
          "The process by which plants convert light energy into chemical energy (glucose) using carbon dioxide and water.",
      },
      {
        id: 2,
        question: "What is the powerhouse of the cell?",
        answer: "The mitochondria - it produces ATP (energy) for cellular processes.",
      },
      {
        id: 3,
        question: "What is DNA?",
        answer: "Deoxyribonucleic acid - the molecule that carries genetic information in living organisms.",
      },
    ],
  },
  {
    id: 2,
    name: "World History",
    description: "Key events and dates in world history",
    cardCount: 12,
    tags: ["History", "Social Studies"],
    cards: [
      {
        id: 1,
        question: "When did World War II end?",
        answer: "September 2, 1945, when Japan formally surrendered aboard the USS Missouri.",
      },
      {
        id: 2,
        question: "Who was the first person to walk on the moon?",
        answer: "Neil Armstrong on July 20, 1969, during the Apollo 11 mission.",
      },
      {
        id: 3,
        question: "When did the Berlin Wall fall?",
        answer: "November 9, 1989, marking a significant moment in the end of the Cold War.",
      },
    ],
  },
]

export default function DemoPage() {
  const [selectedDeck, setSelectedDeck] = useState(demoDecks[0])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyMode, setStudyMode] = useState<"browse" | "study">("browse")
  const [progress, setProgress] = useState(0)

  const currentCard = selectedDeck.cards[currentCardIndex]

  useEffect(() => {
    setProgress(((currentCardIndex + 1) / selectedDeck.cards.length) * 100)
  }, [currentCardIndex, selectedDeck.cards.length])

  const nextCard = () => {
    if (currentCardIndex < selectedDeck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
      setShowAnswer(false)
    }
  }

  const resetDeck = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setShowAnswer(false)
    setProgress(0)
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold">SWIFTCARDS Demo</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Experience the power of AI-generated flashcards with our interactive demo
          </p>
          <Badge variant="secondary" className="px-4 py-2">
            🎯 No signup required - Try it now!
          </Badge>
        </motion.div>

        {studyMode === "browse" ? (
          /* Deck Selection */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Choose a Demo Deck</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {demoDecks.map((deck) => (
                <Card
                  key={deck.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedDeck.id === deck.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedDeck(deck)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {deck.name}
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </CardTitle>
                    <CardDescription>{deck.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">{deck.cardCount} cards</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {deck.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" onClick={() => setStudyMode("study")} className="bg-blue-600 hover:bg-blue-700">
                <Play className="h-5 w-5 mr-2" />
                Start Studying {selectedDeck.name}
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Study Mode */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">{selectedDeck.name}</h2>
                <span className="text-sm text-gray-600">
                  {currentCardIndex + 1} of {selectedDeck.cards.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Flashcard */}
            <div className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard.id}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -90 }}
                  transition={{ duration: 0.3 }}
                  className="perspective-1000"
                >
                  <Card className="min-h-[300px] cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
                    <CardContent className="flex items-center justify-center p-8 h-full">
                      <div className="text-center">
                        {!showAnswer ? (
                          <div>
                            <div className="flex items-center justify-center mb-4">
                              <Badge variant="outline">Question</Badge>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">{currentCard.question}</h3>
                            <p className="text-gray-600 dark:text-gray-400">Click to reveal answer</p>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-center mb-4">
                              <Badge variant="default">Answer</Badge>
                            </div>
                            <p className="text-lg leading-relaxed">{currentCard.answer}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
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
                  onClick={() => speakText(showAnswer ? currentCard.answer : currentCard.question)}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon" onClick={resetDeck}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={nextCard}
                disabled={currentCardIndex === selectedDeck.cards.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Demo Features */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                  <Trophy className="h-5 w-5 mr-2" />
                  Demo Features Showcase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">🎯 Smart Learning</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Spaced repetition algorithms optimize your study sessions
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🔊 Voice Support</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Text-to-speech for auditory learning (click speaker icon)
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📊 Progress Tracking</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Visual progress indicators and performance analytics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back to Selection */}
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setStudyMode("browse")
                  resetDeck()
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Deck Selection
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
