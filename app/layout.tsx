import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseAuthProvider } from "@/components/supabase-auth-provider"
import { FloatingNavbar } from "@/components/floating-navbar"
import { ErrorBoundary } from "@/components/error-boundary"
import { DebugAuth } from "@/components/debug-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SWIFTCARDS – Knowledge on Autopilot",
  description: "Transform your study materials into intelligent flashcards with AI-powered learning. Upload documents, generate flashcards, and master any subject with smart spaced repetition.",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "SWIFTCARDS – Knowledge on Autopilot",
    description: "Transform your study materials into intelligent flashcards with AI-powered learning. Upload documents, generate flashcards, and master any subject with smart spaced repetition.",
    url: "https://swiftcardss.netlify.app",
    siteName: "SWIFTCARDS",
    images: [
      {
        url: "/thumbnail.svg",
        width: 1200,
        height: 630,
        alt: "SWIFTCARDS - AI-Powered Flashcard Learning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SWIFTCARDS – Knowledge on Autopilot",
    description: "Transform your study materials into intelligent flashcards with AI-powered learning. Upload documents, generate flashcards, and master any subject with smart spaced repetition.",
    images: ["/thumbnail.svg"],
    creator: "@swiftcards",
  },
  keywords: [
    "flashcards",
    "AI learning",
    "study tools",
    "spaced repetition",
    "document upload",
    "education",
    "learning app",
    "memory training",
    "academic tools",
    "knowledge management"
  ],
  authors: [{ name: "SWIFTCARDS Team" }],
  creator: "SWIFTCARDS",
  publisher: "SWIFTCARDS",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorBoundary>
            <SupabaseAuthProvider>
              <FloatingNavbar />
              <main>{children}</main>
              <Toaster />
              <DebugAuth />
            </SupabaseAuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
