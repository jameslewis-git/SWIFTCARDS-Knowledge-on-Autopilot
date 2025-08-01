"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, Sun, Moon, User, LogOut, Sparkles, Zap, Rocket, Star, Crown, Menu, X, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { AnimeNavBar } from "@/components/ui/anime-navbar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FloatingNavbar() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useSupabaseAuth()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Navigation items for the AnimeNavBar
  const navItems = [
    { name: "Home", url: "/", icon: Star },
    { name: "Features", url: "/features", icon: Zap },
    { name: "Pricing", url: "/pricing", icon: Crown },
    { name: "Demo", url: "/demo", icon: Rocket },
    { name: "My Decks", url: "/decks", icon: BookOpen },
    { name: "Quiz", url: "/quiz", icon: Brain },
  ]

  // Determine default active tab based on current pathname
  const pathname = usePathname()
  const defaultActive = navItems.find(item => item.url === pathname)?.name || "Home"

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
             {/* Main AnimeNavBar */}
       <div className="pt-5">
         <AnimeNavBar items={navItems} defaultActive={defaultActive} />
       </div>

             {/* Additional Controls - Logo, Theme Toggle, Auth */}
       <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none z-[10000]">
                 {/* Logo */}
         <motion.div
           className="pointer-events-auto relative z-[10001]"
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            y: [0, -5, 0],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Link href="/" className="flex items-center space-x-3 group relative">
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Brain className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors drop-shadow-lg" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-purple-500" />
              </motion.div>
            </div>
            <div className="flex flex-col">
              <motion.span 
                className="text-xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                SWIFTCARDS
              </motion.span>
              <motion.span 
                className="text-xs text-gray-500 dark:text-gray-400 -mt-1 font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Knowledge on Autopilot
              </motion.span>
            </div>
          </Link>
        </motion.div>

                 {/* Right Side Controls */}
         <div className="flex items-center space-x-3 pointer-events-auto relative z-[10001]">
          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              y: [0, -3, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative overflow-hidden group w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 hover:from-yellow-400/40 hover:to-orange-500/40 transition-all duration-300"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-30 transition-opacity rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <div className="relative w-5 h-5">
                <motion.div
                  animate={{ 
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
                </motion.div>
                <motion.div
                  animate={{ 
                    rotate: [360, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0"
                >
                  <Moon className="h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
                </motion.div>
              </div>
            </Button>
          </motion.div>

          {/* Auth Buttons */}
          {user ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20"
                  >
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <User className="h-4 w-4 text-white" />
                    </motion.div>
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/login">
                  <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors px-4 py-2 rounded-full font-semibold text-sm">
                    Login
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ["0 4px 15px rgba(59, 130, 246, 0.3)", "0 8px 25px rgba(147, 51, 234, 0.4)", "0 4px 15px rgba(59, 130, 246, 0.3)"]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-2 rounded-full font-bold text-sm">
                    Sign Up
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 