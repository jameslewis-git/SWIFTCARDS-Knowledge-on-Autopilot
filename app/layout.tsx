import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupabaseAuthProvider } from "@/components/supabase-auth-provider"
import { FloatingNavbar } from "@/components/floating-navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SWIFTCARDS – Knowledge on Autopilot",
  description: "Transform your study materials into intelligent flashcards with AI",
    generator: 'v0.dev'
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
          <SupabaseAuthProvider>
            <FloatingNavbar />
            <main>{children}</main>
            <Toaster />
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
