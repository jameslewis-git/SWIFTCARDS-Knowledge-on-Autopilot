"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, BookOpen, Plus, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UploadSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  deckId: string
  deckName: string
  cardCount: number
}

export function UploadSuccessModal({ isOpen, onClose, deckId, deckName, cardCount }: UploadSuccessModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleViewDeck = () => {
    router.push(`/study/${deckId}`)
    onClose()
  }

  const handleCreateAnother = () => {
    router.push("/upload")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl font-bold">Upload Successful! 🎉</CardTitle>
          <CardDescription>
            Your flashcard deck has been created successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{deckName}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {cardCount} flashcards generated
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleViewDeck}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View & Study Deck
            </Button>
            
            <Button 
              onClick={handleCreateAnother}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Another Deck
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 