"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"

export default function ContactPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative min-h-screen">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white drop-shadow-2xl' : 'text-gray-800'}`}>
            Get in Touch
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Have questions about SWIFTCARDS? We're here to help you succeed in your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className={`backdrop-blur-sm ${
            isDark 
              ? 'bg-white/10 border border-white/20' 
              : 'bg-white/80 border border-gray-200/50'
          }`}>
            <CardHeader>
              <CardTitle className={`text-2xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Send us a Message
              </CardTitle>
              <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className={isDark ? 'text-white' : 'text-gray-700'}>
                    First Name
                  </Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    className={isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className={isDark ? 'text-white' : 'text-gray-700'}>
                    Last Name
                  </Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    className={isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className={isDark ? 'text-white' : 'text-gray-700'}>
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  className={isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="subject" className={isDark ? 'text-white' : 'text-gray-700'}>
                  Subject
                </Label>
                <Input 
                  id="subject" 
                  placeholder="How can we help?" 
                  className={isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}
                />
              </div>
              
              <div>
                <Label htmlFor="message" className={isDark ? 'text-white' : 'text-gray-700'}>
                  Message
                </Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your question or concern..."
                  rows={5}
                  className={isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}
                />
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className={`backdrop-blur-sm ${
              isDark 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-gray-200/50'
            }`}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>
                  Contact Information
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    isDark 
                      ? 'bg-blue-900/30 text-blue-400' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Email Support
                    </h3>
                    <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      support@swiftcards.com
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    isDark 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Live Chat
                    </h3>
                    <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      Available 9 AM - 6 PM EST
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Get instant help from our team
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    isDark 
                      ? 'bg-purple-900/30 text-purple-400' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Phone Support
                    </h3>
                    <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      +1 (555) 123-4567
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Monday - Friday, 9 AM - 5 PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Quick Links */}
            <Card className={`backdrop-blur-sm ${
              isDark 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-gray-200/50'
            }`}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  Quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link 
                  href="/pricing" 
                  className={`block p-3 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    How much does SWIFTCARDS cost?
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Learn about our pricing plans and features
                  </p>
                </Link>
                
                <Link 
                  href="/features" 
                  className={`block p-3 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    What features are included?
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Explore all the capabilities of our platform
                  </p>
                </Link>
                
                <Link 
                  href="/demo" 
                  className={`block p-3 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-white/10' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Can I try before I buy?
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Experience SWIFTCARDS with our free demo
                  </p>
                </Link>
              </CardContent>
            </Card>

            {/* Office Location */}
            <Card className={`backdrop-blur-sm ${
              isDark 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-gray-200/50'
            }`}>
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>
                  Our Office
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  Visit us in person
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${
                    isDark 
                      ? 'bg-orange-900/30 text-orange-400' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      SWIFTCARDS HQ
                    </h3>
                    <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      123 Learning Street<br />
                      Education City, EC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
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
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6">
                Join thousands of students who are already using SWIFTCARDS to accelerate their learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/auth/signup">
                    Start Free Trial
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/demo">
                    Try Demo
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