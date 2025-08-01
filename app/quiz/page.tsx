"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Trophy, Clock, Target, CheckCircle, XCircle, RotateCcw, Play, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"

interface QuizQuestion {
  id: number
  question: string
  correctAnswer: string
  options?: string[]
  type: "multiple-choice" | "fill-in-blank" | "true-false"
  deckName: string
  difficulty: string
}

interface QuizResult {
  questionId: number
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number
}

export default function QuizPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { toast } = useToast()

  const [quizMode, setQuizMode] = useState<"select" | "active" | "results">("select")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [results, setResults] = useState<QuizResult[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [loading, setLoading] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizMode === "active" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && quizMode === "active") {
      // Time's up - submit current answer
      submitAnswer()
    }
    return () => clearInterval(timer)
  }, [timeLeft, quizMode])

  const startQuiz = async (type: "mixed" | "recent" | "difficult") => {
    setLoading(true)
    try {
      const response = await fetch(`/api/quiz/generate?type=${type}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        setQuizMode("active")
        setCurrentQuestionIndex(0)
        setResults([])
        setQuizStartTime(Date.now())
        setQuestionStartTime(Date.now())
        setTimeLeft(30) // 30 seconds per question
        setUserAnswer("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz questions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = () => {
    if (!currentQuestion) return

    const timeSpent = Date.now() - questionStartTime
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()

    const result: QuizResult = {
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeSpent,
    }

    setResults((prev) => [...prev, result])

    // Move to next question or finish quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setUserAnswer("")
      setQuestionStartTime(Date.now())
      setTimeLeft(30)
    } else {
      finishQuiz([...results, result])
    }
  }

  const finishQuiz = async (finalResults: QuizResult[]) => {
    setQuizMode("results")

    // Calculate stats
    const correctAnswers = finalResults.filter((r) => r.isCorrect).length
    const totalTime = Date.now() - quizStartTime
    const accuracy = (correctAnswers / finalResults.length) * 100

    // Award XP based on performance
    const xpEarned = Math.floor(correctAnswers * 10 + (accuracy > 80 ? 50 : 0))

    try {
      await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results: finalResults,
          totalTime,
          xpEarned,
        }),
      })

      toast({
        title: "Quiz Complete! 🎉",
        description: `You scored ${correctAnswers}/${finalResults.length} and earned ${xpEarned} XP!`,
      })
    } catch (error) {
      console.error("Failed to save quiz results:", error)
    }
  }

  const resetQuiz = () => {
    setQuizMode("select")
    setQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswer("")
    setResults([])
    setTimeLeft(0)
  }

  if (!user) {
    return (
      <div className="min-h-screen relative">
        {/* Background */}
        <GalaxyBackground />
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-32">
          <Card className={`w-full max-w-md backdrop-blur-sm ${
            isDark 
              ? 'bg-white/10 border border-white/20' 
              : 'bg-white/80 border border-gray-200/50'
          }`}>
            <CardContent className="text-center p-8">
          <Trophy className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Please sign in</h2>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>You need to be signed in to take quizzes.</p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (quizMode === "select") {
    return (
      <div className="min-h-screen relative">
        {/* Background */}
        <GalaxyBackground />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Trophy className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Quiz Mode</h1>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Test your knowledge with AI-generated quiz questions
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full backdrop-blur-sm bg-black/20 border border-white/20 hover:bg-black/30">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <Target className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-center">Mixed Review</CardTitle>
                  <CardDescription className="text-center">
                    Questions from all your decks with varying difficulty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => startQuiz("mixed")} disabled={loading}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Mixed Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full backdrop-blur-sm bg-black/20 border border-white/20 hover:bg-black/30">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <Clock className="h-12 w-12 text-green-600" />
                  </div>
                  <CardTitle className="text-center">Recent Cards</CardTitle>
                  <CardDescription className="text-center">Focus on cards you've studied recently</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => startQuiz("recent")}
                    disabled={loading}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Recent Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full backdrop-blur-sm bg-black/20 border border-white/20 hover:bg-black/30">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <Trophy className="h-12 w-12 text-red-600" />
                  </div>
                  <CardTitle className="text-center">Challenge Mode</CardTitle>
                  <CardDescription className="text-center">Difficult questions you've struggled with</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => startQuiz("difficult")}
                    disabled={loading}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Challenge Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Don't have any flashcards yet?</p>
            <Link href="/upload">
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Your First Deck
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (quizMode === "active") {
    return (
      <div className="min-h-screen relative">
        {/* Background */}
        <GalaxyBackground />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-8">
          {/* Quiz Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className={`font-mono ${timeLeft <= 10 ? "text-red-600" : ""}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={resetQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Exit Quiz
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion?.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="mb-8 backdrop-blur-sm bg-black/20 border border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary">{currentQuestion?.deckName}</Badge>
                      <Badge
                        variant={
                          currentQuestion?.difficulty === "easy"
                            ? "default"
                            : currentQuestion?.difficulty === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {currentQuestion?.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{currentQuestion?.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {currentQuestion?.type === "multiple-choice" && currentQuestion.options ? (
                      <RadioGroup value={userAnswer} onValueChange={setUserAnswer}>
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${index}`} />
                            <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Input
                        placeholder="Type your answer..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && submitAnswer()}
                        className="text-lg"
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="text-center">
              <Button size="lg" onClick={submitAnswer} disabled={!userAnswer.trim()} className="px-8">
                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (quizMode === "results") {
    const correctAnswers = results.filter((r) => r.isCorrect).length
    const accuracy = (correctAnswers / results.length) * 100
    const totalTime = results.reduce((sum, r) => sum + r.timeSpent, 0)

    return (
      <div className="min-h-screen relative">
        {/* Background */}
        <GalaxyBackground />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>Quiz Complete!</h1>
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Correct</div>
              </div>
              <div className="text-center">
                  <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{results.length}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{accuracy.toFixed(1)}%</div>
                  <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Accuracy</div>
                </div>
            </div>
          </motion.div>

          {/* Results Details */}
          <div className="max-w-4xl mx-auto space-y-4 mb-8">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-l-4 backdrop-blur-sm bg-black/20 border border-white/20 ${result.isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-2">Question {index + 1}</p>
                        <p className="text-sm text-gray-600 mb-2">Your answer: {result.userAnswer}</p>
                        {!result.isCorrect && (
                          <p className="text-sm text-green-600">Correct answer: {result.correctAnswer}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {result.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="text-sm text-gray-500">{(result.timeSpent / 1000).toFixed(1)}s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center space-x-4">
            <Button onClick={resetQuiz} size="lg">
              Take Another Quiz
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return null
}
