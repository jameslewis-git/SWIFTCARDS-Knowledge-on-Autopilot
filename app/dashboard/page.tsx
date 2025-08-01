"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, BookOpen, Trophy, TrendingUp, Brain, Target, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"

interface DeckStats {
  totalDecks: number
  totalCards: number
  studiedToday: number
  streak: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [stats, setStats] = useState<DeckStats>({
    totalDecks: 0,
    totalCards: 0,
    studiedToday: 0,
    streak: 0,
  })
  const [recentDecks, setRecentDecks] = useState([])

  useEffect(() => {
    // Fetch user stats and recent decks
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentDecks(data.recentDecks)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen relative">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <GalaxyBackground />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen pt-32">
          <Card className={`w-full max-w-md backdrop-blur-sm ${
            isDark 
              ? 'bg-white/10 border border-white/20' 
              : 'bg-white/80 border border-gray-200/50'
          }`}>
            <CardContent className="text-center p-8">
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Please sign in</h2>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>You need to be signed in to access your dashboard.</p>
              <Link href="/auth/login">
                <Button>Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <GalaxyBackground />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Welcome back, {user.name}!</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Ready to continue your learning journey?</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Decks</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDecks}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCards}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Studied Today</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.studiedToday}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.streak} days</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer backdrop-blur-sm bg-black/20 border border-white/20 hover:bg-black/30">
            <Link href="/upload">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Upload className="h-6 w-6 text-blue-600" />
                  <CardTitle>Upload Materials</CardTitle>
                </div>
                <CardDescription>Upload PDFs, images, videos, or text to generate flashcards</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer backdrop-blur-sm bg-black/20 border border-white/20 hover:bg-black/30">
            <Link href="/decks">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  <CardTitle>Browse Decks</CardTitle>
                </div>
                <CardDescription>View and manage all your flashcard decks</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer backdrop-blur-sm bg-black/20 border border-white/20 hover:bg-black/30">
            <Link href="/quiz">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-purple-600" />
                  <CardTitle>Start Quiz</CardTitle>
                </div>
                <CardDescription>Test your knowledge with interactive quizzes</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Level Progress */}
          <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Level {user.level}</span>
                  <span className="text-sm text-gray-600">{user.xp} XP</span>
                </div>
                <Progress value={(user.xp % 1000) / 10} className="h-2" />
                <p className="text-xs text-gray-600">{1000 - (user.xp % 1000)} XP to next level</p>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.badges.length > 0 ? (
                  user.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary">
                      {badge}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">Start studying to earn your first badge!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
