"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X, Sun, Moon, User, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">SWIFTCARDS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/features"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Pricing
            </Link>
            <Link href="/demo" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Demo
            </Link>
            <Link href="/decks" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              My Decks
            </Link>
            <Link href="/quiz" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Quiz
            </Link>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link href="/features" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Features
              </Link>
              <Link href="/pricing" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Pricing
              </Link>
              <Link href="/demo" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Demo
              </Link>
              <Link href="/decks" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                My Decks
              </Link>
              <Link href="/quiz" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                Quiz
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-left text-gray-600 hover:text-gray-900 dark:text-gray-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                    Login
                  </Link>
                  <Link href="/auth/signup" className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
