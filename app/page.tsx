"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Upload, Zap, Trophy, Users, Globe, Mic, Eye } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { motion } from "framer-motion"
import { AuroraBackground } from "@/components/aurora-background"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AuroraBackground>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SWIFTCARDS
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your study materials into intelligent flashcards with AI. Upload PDFs, images, videos, or text
              and let our AI create personalized learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button size="lg" variant="outline">
                      Try Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Upload className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Smart Upload</CardTitle>
                <CardDescription>
                  Upload PDFs, images, videos, or text. Our AI extracts content with OCR and speech-to-text.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>AI Generation</CardTitle>
                <CardDescription>
                  Automatically generate high-quality Q&A flashcards using advanced AI models.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Trophy className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Gamified Learning</CardTitle>
                <CardDescription>
                  Earn XP, unlock badges, and track your progress with spaced repetition algorithms.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Advanced Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Advanced Features</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                Collaboration
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                Multilingual
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Mic className="h-4 w-4 mr-2" />
                Voice Support
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                Accessibility
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>
    </AuroraBackground>
  )
}
