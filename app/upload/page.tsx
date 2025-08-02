"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, FileText, ImageIcon, Video, Brain, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { supabase } from "@/lib/supabase"
import { UploadSuccessModal } from "@/components/upload-success-modal"

interface UploadedFile {
  file: File
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  cards?: any[]
  error?: string
}

export default function UploadPage() {
  const { theme } = useTheme()
  const { user } = useSupabaseAuth()
  const isDark = theme === 'dark'
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [textInput, setTextInput] = useState("")
  const [deckName, setDeckName] = useState("")
  const [tags, setTags] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successDeckData, setSuccessDeckData] = useState<{ id: string; name: string; cardCount: number } | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        status: "uploading" as const,
        progress: 0,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Process each file
      newFiles.forEach((fileObj, index) => {
        processFile(fileObj, uploadedFiles.length + index)
      })
    },
    [uploadedFiles.length],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "video/*": [".mp4", ".avi", ".mov"],
      "text/*": [".txt", ".md"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  })

  const processFile = async (fileObj: UploadedFile, index: number) => {
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("Not authenticated")
      }

      const formData = new FormData()
      formData.append("file", fileObj.file)
      formData.append("deckName", deckName || fileObj.file.name)
      formData.append("tags", tags)

      // Update status to processing
      setUploadedFiles((prev) => prev.map((f, i) => (i === index ? { ...f, status: "processing", progress: 50 } : f)))

      const response = await fetch("/api/upload/process", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()

      // Update with completed status
      setUploadedFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "completed",
                progress: 100,
                cards: result.cards,
              }
            : f,
        ),
      )

      // Show success modal
      setSuccessDeckData({
        id: result.deckId,
        name: result.deckName || fileObj.file.name,
        cardCount: result.cards.length
      })
      setShowSuccessModal(true)

      toast({
        title: "Success!",
        description: `Generated ${result.cards.length} flashcards from ${fileObj.file.name}`,
      })
    } catch (error) {
      setUploadedFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error",
              }
            : f,
        ),
      )

      toast({
        title: "Upload failed",
        description: `Failed to process ${fileObj.file.name}`,
        variant: "destructive",
      })
    }
  }

  const processTextInput = async () => {
    if (!textInput.trim()) return

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/upload/text", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          text: textInput,
          deckName: deckName || "Text Input Deck",
          tags,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `Processing failed with status ${response.status}`)
      }

      const result = await response.json()

      // Show success modal
      setSuccessDeckData({
        id: result.deckId,
        name: result.deckName || "Text Input Deck",
        cardCount: result.cards.length
      })
      setShowSuccessModal(true)

      toast({
        title: "Success!",
        description: `Generated ${result.cards.length} flashcards from your text`,
      })

      // Clear the text input
      setTextInput("")
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to generate flashcards from text",
        variant: "destructive",
      })
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-6 w-6" />
    if (file.type.startsWith("video/")) return <Video className="h-6 w-6" />
    if (file.type === "application/pdf") return <FileText className="h-6 w-6" />
    return <FileText className="h-6 w-6" />
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <GalaxyBackground />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Upload Study Materials</h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Upload your PDFs, images, videos, or paste text to generate AI-powered flashcards
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Deck Settings */}
            <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
              <CardHeader>
                <CardTitle>Deck Settings</CardTitle>
                <CardDescription>Configure your new flashcard deck</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deckName">Deck Name</Label>
                  <Input
                    id="deckName"
                    placeholder="Enter deck name (optional)"
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Drag and drop files or click to browse. Supports PDF, images, videos, and text files.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">Drag & drop files here, or click to select files</p>
                      <p className="text-sm text-gray-500">PDF, Images, Videos, Text files (max 50MB)</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Text Input */}
            <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
              <CardHeader>
                <CardTitle>Or Paste Text</CardTitle>
                <CardDescription>Paste your study notes or any text content to generate flashcards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your study notes, lecture transcripts, or any text content here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={6}
                />
                <Button onClick={processTextInput} disabled={!textInput.trim()} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Flashcards from Text
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Processing Status */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="backdrop-blur-sm bg-black/20 border border-white/20">
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
                <CardDescription>Track the progress of your uploaded files</CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No files uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uploadedFiles.map((fileObj, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getFileIcon(fileObj.file)}
                            <span className="font-medium truncate">{fileObj.file.name}</span>
                          </div>
                          {getStatusIcon(fileObj.status)}
                        </div>

                        {fileObj.status !== "error" && <Progress value={fileObj.progress} className="mb-2" />}

                        <div className="flex items-center justify-between text-sm">
                          <Badge
                            variant={
                              fileObj.status === "completed"
                                ? "default"
                                : fileObj.status === "error"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {fileObj.status}
                          </Badge>

                          {fileObj.cards && (
                            <span className="text-gray-600">{fileObj.cards.length} cards generated</span>
                          )}
                        </div>

                        {fileObj.error && <p className="text-sm text-red-600 mt-2">{fileObj.error}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      {successDeckData && (
        <UploadSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false)
            setSuccessDeckData(null)
          }}
          deckId={successDeckData.id}
          deckName={successDeckData.name}
          cardCount={successDeckData.cardCount}
        />
      )}
    </div>
  )
}
