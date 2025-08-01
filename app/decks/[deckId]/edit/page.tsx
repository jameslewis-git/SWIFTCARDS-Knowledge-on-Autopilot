"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check,
  BookOpen,
  Target,
  Calendar,
  Tag
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Flashcard {
  id: number
  question: string
  answer: string
  reviewCount: number
  correctCount: number
  lastReviewed?: string
  nextReview?: string
}

interface Deck {
  _id: string
  name: string
  description: string
  cards: Flashcard[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function EditDeckPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  
  const [deck, setDeck] = useState<Deck | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingCard, setEditingCard] = useState<number | null>(null)
  const [newTag, setNewTag] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [] as string[]
  })

  const [editingCardData, setEditingCardData] = useState({
    question: "",
    answer: ""
  })

  useEffect(() => {
    if (user && params.deckId) {
      fetchDeck()
    }
  }, [user, params.deckId])

  const fetchDeck = async () => {
    try {
      const response = await fetch(`/api/decks/${params.deckId}`)
      if (response.ok) {
        const data = await response.json()
        setDeck(data.deck)
        setFormData({
          name: data.deck.name,
          description: data.deck.description,
          tags: data.deck.tags
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to load deck.",
          variant: "destructive",
        })
        router.push("/decks")
      }
    } catch (error) {
      console.error("Failed to fetch deck:", error)
      toast({
        title: "Error",
        description: "Failed to load deck.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveDeck = async () => {
    if (!deck) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/decks/${deck._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Deck updated successfully.",
        })
        // Update local state
        setDeck({
          ...deck,
          ...formData
        })
      } else {
        throw new Error("Failed to update deck")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update deck.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addCard = () => {
    if (!deck) return
    
    const newCard: Flashcard = {
      id: Math.max(...deck.cards.map(c => c.id), 0) + 1,
      question: "",
      answer: "",
      reviewCount: 0,
      correctCount: 0
    }
    
    setDeck({
      ...deck,
      cards: [...deck.cards, newCard]
    })
    setEditingCard(newCard.id)
    setEditingCardData({ question: "", answer: "" })
  }

  const saveCard = (cardId: number) => {
    if (!deck) return
    
    const updatedCards = deck.cards.map(card => 
      card.id === cardId 
        ? { ...card, ...editingCardData }
        : card
    )
    
    setDeck({
      ...deck,
      cards: updatedCards
    })
    setEditingCard(null)
    setEditingCardData({ question: "", answer: "" })
  }

  const deleteCard = (cardId: number) => {
    if (!deck) return
    
    setDeck({
      ...deck,
      cards: deck.cards.filter(card => card.id !== cardId)
    })
    setEditingCard(null)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to edit decks.</p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading deck...</p>
        </div>
      </div>
    )
  }

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Deck not found</h2>
          <p className="text-gray-600 mb-4">The deck you're looking for doesn't exist.</p>
          <Link href="/decks">
            <Button>Back to Decks</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/decks">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Deck</h1>
              <p className="text-gray-600 dark:text-gray-400">Modify your flashcard deck</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={saveDeck} disabled={saving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deck Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Deck Information</CardTitle>
                <CardDescription>Basic details about your deck</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Deck Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter deck name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your deck"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button onClick={addTag} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Deck Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Total Cards</span>
                    <span className="font-medium">{deck.cards.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Created</span>
                    <span className="text-sm">{new Date(deck.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Last Updated</span>
                    <span className="text-sm">{new Date(deck.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flashcards */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Flashcards</CardTitle>
                    <CardDescription>Edit your flashcard content</CardDescription>
                  </div>
                  <Button onClick={addCard} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Card
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deck.cards.map((card, index) => (
                    <Card key={card.id} className="border-2 border-gray-100 dark:border-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-sm font-medium text-gray-500">Card {index + 1}</span>
                          <div className="flex gap-2">
                            {editingCard === card.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveCard(card.id)}
                                  className="flex items-center gap-1"
                                >
                                  <Check className="h-3 w-3" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingCard(null)}
                                  className="flex items-center gap-1"
                                >
                                  <X className="h-3 w-3" />
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingCard(card.id)
                                    setEditingCardData({
                                      question: card.question,
                                      answer: card.answer
                                    })
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <Edit3 className="h-3 w-3" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteCard(card.id)}
                                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {editingCard === card.id ? (
                          <div className="space-y-3">
                            <div>
                              <Label>Question</Label>
                              <Textarea
                                value={editingCardData.question}
                                onChange={(e) => setEditingCardData({ ...editingCardData, question: e.target.value })}
                                placeholder="Enter the question"
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label>Answer</Label>
                              <Textarea
                                value={editingCardData.answer}
                                onChange={(e) => setEditingCardData({ ...editingCardData, answer: e.target.value })}
                                placeholder="Enter the answer"
                                rows={2}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Question</Label>
                              <p className="text-sm">{card.question || "No question set"}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-600">Answer</Label>
                              <p className="text-sm">{card.answer || "No answer set"}</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Reviews: {card.reviewCount}</span>
                              <span>Correct: {card.correctCount}</span>
                              {card.lastReviewed && (
                                <span>Last: {new Date(card.lastReviewed).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {deck.cards.length === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No flashcards yet</h3>
                      <p className="text-gray-600 mb-4">Add your first flashcard to get started</p>
                      <Button onClick={addCard}>Add First Card</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 