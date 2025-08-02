"use client"

import { useState, useEffect } from "react"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, MoreVertical, Edit, Trash2, Share, Play, Calendar, Target } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase"

interface Deck {
  id: string
  name: string
  description: string
  cards: any[]
  tags: string[]
  created_at: string
  updated_at: string
  stats: {
    total_views: number
    total_study_sessions: number
    average_score: number
  }
}

export default function DecksPage() {
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  useEffect(() => {
    if (user) {
      fetchDecks()
    }
  }, [user])

  const fetchDecks = async () => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("No user found")
        return
      }

      // Fetch decks directly from Supabase
      const { data: decks, error } = await supabase
        .from('decks')
        .select(`
          id,
          name,
          description,
          tags,
          created_at,
          updated_at,
          stats,
          cards (
            id,
            front
          )
        `)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) {
        console.error("Database error:", error)
        return
      }

      setDecks(decks || [])
    } catch (error) {
      console.error("Failed to fetch decks:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDeck = async (deckId: string) => {
    try {
      // Delete the deck directly from Supabase
      const { error } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId)

      if (error) {
        console.error("Delete error:", error)
        toast({
          title: "Error",
          description: "Failed to delete deck.",
          variant: "destructive",
        })
        return
      }

      // Remove from local state
      setDecks(decks.filter((deck) => deck.id !== deckId))
      toast({
        title: "Deck deleted",
        description: "The deck has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete deck.",
        variant: "destructive",
      })
    }
  }

  const filteredDecks = decks.filter((deck) => {
    const matchesSearch =
      deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || deck.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const allTags = [...new Set(decks.flatMap((deck) => deck.tags))]

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Galaxy Background */}
        <GalaxyBackground />
        
        {/* Content */}
        <div className="relative z-10 text-center pt-32">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Please sign in
          </h2>
          <p className={`mb-4 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
            You need to be signed in to view your decks.
          </p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Galaxy Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                My Flashcard Decks
              </h1>
              <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                Manage and study your AI-generated flashcard collections
              </p>
            </div>
            <Link href="/upload">
              <Button className="bg-blue-600 hover:bg-blue-700">Create New Deck</Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search decks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}`}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className={`px-3 py-2 border rounded-md bg-background ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Decks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className={`animate-pulse backdrop-blur-sm ${
                isDark 
                  ? 'bg-white/10 border border-white/20' 
                  : 'bg-white/80 border border-gray-200/50'
              }`}>
                <CardHeader>
                  <div className={`h-4 rounded w-3/4 mb-2 ${
                    isDark ? 'bg-white/20' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-3 rounded w-1/2 ${
                    isDark ? 'bg-white/20' : 'bg-gray-200'
                  }`}></div>
                </CardHeader>
                <CardContent>
                  <div className={`h-3 rounded w-full mb-2 ${
                    isDark ? 'bg-white/20' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-3 rounded w-2/3 ${
                    isDark ? 'bg-white/20' : 'bg-gray-200'
                  }`}></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDecks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
              No decks found
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
              {searchTerm || selectedTag
                ? "Try adjusting your search criteria"
                : "Create your first flashcard deck to get started"}
            </p>
            <Link href="/upload">
              <Button>Create Your First Deck</Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDecks.map((deck, index) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`hover:shadow-lg transition-shadow backdrop-blur-sm ${
                  isDark 
                    ? 'bg-white/10 border border-white/20 hover:bg-white/15' 
                    : 'bg-white/80 border border-gray-200/50 hover:bg-white/90 hover:shadow-2xl'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className={`text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {deck.name}
                        </CardTitle>
                        <CardDescription className={`line-clamp-2 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                          {deck.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/study/${deck.id}`}>
                              <Play className="h-4 w-4 mr-2" />
                              Study
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/decks/${deck.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => deleteDeck(deck.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className={`flex items-center justify-between text-sm ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        <div className="flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          {deck.cards?.length || 0} cards
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(deck.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Tags */}
                      {deck.tags && deck.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {deck.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className={`text-xs ${
                              isDark 
                                ? 'bg-white/20 border border-white/30 text-white' 
                                : 'bg-gray-100/80 border border-gray-200/50 text-gray-700'
                            }`}>
                              {tag}
                            </Badge>
                          ))}
                          {deck.tags.length > 3 && (
                            <Badge variant="secondary" className={`text-xs ${
                              isDark 
                                ? 'bg-white/20 border border-white/30 text-white' 
                                : 'bg-gray-100/80 border border-gray-200/50 text-gray-700'
                            }`}>
                              +{deck.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Study Button */}
                      <Link href={`/study/${deck.id}`}>
                        <Button className="w-full bg-transparent" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Start Studying
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
