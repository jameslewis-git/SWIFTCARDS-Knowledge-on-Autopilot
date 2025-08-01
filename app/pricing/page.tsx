"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Users, Infinity, Upload, Brain } from "lucide-react"
import Link from "next/link"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"

export default function PricingPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with flashcard learning",
      icon: <Star className="h-6 w-6" />,
      badge: "Popular",
      features: [
        "Up to 5 flashcard decks",
        "Basic AI generation (10 cards/day)",
        "Standard study modes",
        "Mobile responsive",
        "Community support"
      ],
      limitations: [
        "Limited AI generations",
        "No advanced analytics",
        "No collaboration features"
      ],
      cta: "Get Started Free",
      href: "/auth/signup",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "For serious students who want to accelerate their learning",
      icon: <Zap className="h-6 w-6" />,
      badge: "Most Popular",
      features: [
        "Unlimited flashcard decks",
        "Unlimited AI generation",
        "Advanced study modes",
        "Progress analytics",
        "Spaced repetition",
        "Voice support",
        "Priority support",
        "Export to Anki"
      ],
      limitations: [],
      cta: "Start Pro Trial",
      href: "/auth/signup?plan=pro",
      popular: true
    },
    {
      name: "Team",
      price: "$29.99",
      period: "per month",
      description: "For study groups and educational institutions",
      icon: <Users className="h-6 w-6" />,
      badge: "Collaborative",
      features: [
        "Everything in Pro",
        "Up to 10 team members",
        "Shared flashcard decks",
        "Collaborative editing",
        "Team analytics",
        "Admin dashboard",
        "Custom branding",
        "API access"
      ],
      limitations: [],
      cta: "Contact Sales",
      href: "/contact",
      popular: false
    }
  ]

  const features = [
    {
      icon: <Brain className="h-5 w-5" />,
      title: "AI-Powered Generation",
      description: "Create flashcards from any content using GPT-4"
    },
    {
      icon: <Upload className="h-5 w-5" />,
      title: "Multi-Format Upload",
      description: "PDFs, images, videos, and text files supported"
    },
    {
      icon: <Infinity className="h-5 w-5" />,
      title: "Unlimited Storage",
      description: "Store as many flashcards as you need"
    },
    {
      icon: <Crown className="h-5 w-5" />,
      title: "Premium Support",
      description: "Get help when you need it most"
    }
  ]

  return (
    <div className="relative min-h-screen">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white drop-shadow-2xl' : 'text-gray-800'}`}>
            Simple, Transparent Pricing
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Choose the plan that fits your learning needs. Start free and upgrade when you're ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
                plan.popular 
                  ? `border-2 border-blue-500 scale-105 ${isDark ? 'bg-white/15 border-white/30' : 'bg-white/95'}` 
                  : `border-0 backdrop-blur-sm ${isDark ? 'bg-white/10 border border-white/20 hover:bg-white/15' : 'bg-white/80 border border-gray-200/50 hover:bg-white/90 hover:shadow-2xl'}`
              }`}
            >
              {plan.popular && (
                <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${
                  isDark ? 'bg-blue-500/90 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {plan.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-lg ${
                    isDark 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className={`text-2xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {plan.name}
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {plan.price}
                  </span>
                  <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                    /{plan.period}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center text-gray-400">
                      <span className="h-4 w-4 mr-3 flex-shrink-0">×</span>
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  asChild 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : isDark 
                        ? 'bg-white text-gray-900 hover:bg-gray-100' 
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  <Link href={plan.href}>
                    {plan.cta}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            All Plans Include
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className={`p-2 rounded-lg ${
                    isDark 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={`backdrop-blur-sm ${
              isDark 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-gray-200/50'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Can I cancel anytime?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  Yes! You can cancel your subscription at any time. No long-term commitments required.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`backdrop-blur-sm ${
              isDark 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-gray-200/50'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Is there a free trial?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  Yes! Start with our free plan and upgrade to Pro with a 7-day free trial.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`backdrop-blur-sm ${
              isDark 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-gray-200/50'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  What payment methods do you accept?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  We accept all major credit cards, PayPal, and Apple Pay for your convenience.
                </p>
              </CardContent>
            </Card>
            
            <Card className={`backdrop-blur-sm ${
              isDark 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-gray-200/50'
            }`}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Do you offer student discounts?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  Yes! Students get 50% off Pro plans with a valid .edu email address.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className={`max-w-2xl mx-auto border-0 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm border border-white/20' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600'
          } text-white`}>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-blue-100 mb-6">
                Our team is here to help you choose the right plan for your learning journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/demo">
                    Try Demo First
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