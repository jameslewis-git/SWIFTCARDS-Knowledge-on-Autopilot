"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Upload, BookOpen, Trophy, Users, Zap, Shield, Globe, Headphones } from "lucide-react"
import Link from "next/link"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"

export default function FeaturesPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Generation",
      description: "Upload any content and let our AI create intelligent flashcards automatically using GPT-4 technology.",
      badge: "Core Feature"
    },
    {
      icon: <Upload className="h-8 w-8" />,
      title: "Smart File Upload",
      description: "Support for PDFs, images (with OCR), videos (with speech-to-text), and text files.",
      badge: "Multi-Format"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Interactive Learning",
      description: "Flip cards, take quizzes, and track your progress with spaced repetition algorithms.",
      badge: "Engaging"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Gamification",
      description: "Earn XP, unlock badges, and climb levels as you master your study materials.",
      badge: "Motivating"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Collaboration",
      description: "Share decks with classmates and collaborate on study materials together.",
      badge: "Social"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Voice Support",
      description: "Text-to-speech and speech-to-text capabilities for hands-free studying.",
      badge: "Accessible"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. Full control over your study materials.",
      badge: "Secure"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-Platform",
      description: "Access your flashcards on any device - desktop, tablet, or mobile.",
      badge: "Universal"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Accessibility",
      description: "High contrast, keyboard navigation, and screen reader support for all users.",
      badge: "Inclusive"
    }
  ]

  const techStack = [
    "Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "MongoDB", "OpenAI GPT-4", "JWT Auth", "Framer Motion"
  ]

  return (
    <div className="relative min-h-screen">
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <GalaxyBackground />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white drop-shadow-2xl' : 'text-gray-800'}`}>
            Powerful Features
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Transform your study materials into intelligent learning experiences with cutting-edge AI technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className={`group hover:shadow-lg transition-all duration-300 border-0 backdrop-blur-sm transform hover:scale-105 ${
              isDark 
                ? 'bg-white/10 border border-white/20 hover:bg-white/15' 
                : 'bg-white/80 border border-gray-200/50 hover:bg-white/90 hover:shadow-2xl'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg transition-transform group-hover:scale-110 ${
                    isDark 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className={`text-xs ${
                    isDark 
                      ? 'bg-white/20 border border-white/30 text-white' 
                      : 'bg-gray-100/80 border border-gray-200/50 text-gray-700'
                  }`}>
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Built with Modern Technology
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="outline" className={`text-sm px-4 py-2 ${
                isDark 
                  ? 'border-white/30 text-white hover:bg-white/10' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className={`max-w-2xl mx-auto border-0 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm border border-white/20' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          } text-white`}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Learning?</h3>
              <p className="text-blue-100 mb-6">
                Join thousands of students who are already using SWIFTCARDS to master their subjects faster and more effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/demo">
                    Try Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/auth/signup">
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 