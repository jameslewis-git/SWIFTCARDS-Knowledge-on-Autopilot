import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, Upload, BookOpen, Trophy, Users, Zap, Shield, Globe, Headphones } from "lucide-react"
import Link from "next/link"

export default function FeaturesPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Powerful Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your study materials into intelligent learning experiences with cutting-edge AI technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Built with Modern Technology</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="outline" className="text-sm px-4 py-2">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
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