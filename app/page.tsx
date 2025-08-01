"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Upload, Zap, Trophy, Users, Globe, Mic, Eye } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-32 px-4 z-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 relative z-30">
              <div className="flex items-center justify-center mb-6">
                <div className={`relative ${isDark ? 'animate-pulse' : 'animate-bounce'}`}>
                  <Brain className="h-12 w-12 text-blue-400 mr-3" />
                  {!isDark && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-lg animate-pulse" />
                  )}
                </div>
                <h1 className={`text-6xl font-bold relative z-20 ${isDark ? 'text-white drop-shadow-2xl' : 'text-gray-800'} ${!isDark ? 'animate-pulse' : ''}`}>
                  SWIFTCARDS
                </h1>
              </div>
              <p className={`text-xl mb-8 max-w-3xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Transform your study materials into intelligent flashcards with AI. Upload PDFs, images, videos, or text
                and let our AI create personalized learning experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link href="/dashboard">
                    <Button size="lg" className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'}`}>
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/signup">
                      <Button size="lg" className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'}`}>
                      Get Started Free
                    </Button>
                    </Link>
                    <Link href="/demo">
                      <Button size="lg" variant="outline" className={`${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'}`}>
                        Try Demo
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className={`border-0 shadow-2xl backdrop-blur-md transform hover:scale-105 transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 border border-white/20 hover:bg-white/15' 
                  : 'bg-white/80 border border-gray-200/50 hover:bg-white/90 hover:shadow-2xl'
              }`}>
                <CardHeader>
                  <div className={`relative ${!isDark ? 'animate-bounce' : ''}`}>
                    <Upload className="h-10 w-10 text-blue-400 mb-2" />
                    {!isDark && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-sm animate-pulse" />
                    )}
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>Smart Upload</CardTitle>
                  <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                    Upload PDFs, images, videos, or text. Our AI extracts content with OCR and speech-to-text.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className={`border-0 shadow-2xl backdrop-blur-md transform hover:scale-105 transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 border border-white/20 hover:bg-white/15' 
                  : 'bg-white/80 border border-gray-200/50 hover:bg-white/90 hover:shadow-2xl'
              }`}>
                <CardHeader>
                  <div className={`relative ${!isDark ? 'animate-pulse' : ''}`}>
                    <Zap className="h-10 w-10 text-purple-400 mb-2" />
                    {!isDark && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-sm animate-pulse" />
                    )}
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>AI Generation</CardTitle>
                  <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                    Automatically generate high-quality Q&A flashcards using advanced AI models.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className={`border-0 shadow-2xl backdrop-blur-md transform hover:scale-105 transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 border border-white/20 hover:bg-white/15' 
                  : 'bg-white/80 border border-gray-200/50 hover:bg-white/90 hover:shadow-2xl'
              }`}>
                <CardHeader>
                  <div className={`relative ${!isDark ? 'animate-bounce' : ''}`}>
                    <Trophy className="h-10 w-10 text-green-400 mb-2" />
                    {!isDark && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full blur-sm animate-pulse" />
                    )}
                  </div>
                  <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>Gamified Learning</CardTitle>
                  <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                    Earn XP, unlock badges, and track your progress with spaced repetition algorithms.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Advanced Features */}
            <div className="text-center">
              <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>Advanced Features</h2>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <Badge variant="secondary" className={`px-4 py-2 backdrop-blur-md ${
                  isDark 
                    ? 'bg-white/20 border border-white/30 text-white' 
                    : 'bg-gray-100/80 border border-gray-200/50 text-gray-700'
                }`}>
                  <Users className="h-4 w-4 mr-2" />
                  Collaboration
                </Badge>
                <Badge variant="secondary" className={`px-4 py-2 backdrop-blur-md ${
                  isDark 
                    ? 'bg-white/20 border border-white/30 text-white' 
                    : 'bg-gray-100/80 border border-gray-200/50 text-gray-700'
                }`}>
                  <Globe className="h-4 w-4 mr-2" />
                  Multilingual
                </Badge>
                <Badge variant="secondary" className={`px-4 py-2 backdrop-blur-md ${
                  isDark 
                    ? 'bg-white/20 border border-white/30 text-white' 
                    : 'bg-gray-100/80 border border-gray-200/50 text-gray-700'
                }`}>
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Support
                </Badge>
                <Badge variant="secondary" className={`px-4 py-2 backdrop-blur-md ${
                  isDark 
                    ? 'bg-white/20 border border-white/30 text-white' 
                    : 'bg-gray-100/80 border border-gray-200/50 text-gray-700'
                }`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Accessibility
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
