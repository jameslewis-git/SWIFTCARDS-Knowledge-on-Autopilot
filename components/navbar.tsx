"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X, Sun, Moon, User, LogOut, Sparkles, Zap, Rocket, Star, Crown } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "@/hooks/use-auth"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: "/features", label: "Features", icon: Zap, color: "from-blue-500 to-cyan-500" },
    { href: "/pricing", label: "Pricing", icon: Crown, color: "from-purple-500 to-pink-500" },
    { href: "/demo", label: "Demo", icon: Rocket, color: "from-green-500 to-emerald-500" },
    { href: "/decks", label: "My Decks", icon: Star, color: "from-yellow-500 to-orange-500" },
    { href: "/quiz", label: "Quiz", icon: Brain, color: "from-indigo-500 to-purple-500" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-2xl' 
          : 'bg-gradient-to-r from-white/20 via-white/10 to-white/20 dark:from-gray-900/20 dark:via-gray-900/10 dark:to-gray-900/20 backdrop-blur-xl'
      } relative overflow-hidden`}
    >
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        <motion.div
          className="absolute top-4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-8 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full"
          animate={{ 
            y: [0, -8, 0],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute top-2 right-1/4 w-1.5 h-1.5 bg-pink-400/30 rounded-full"
          animate={{ 
            y: [0, -12, 0],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-6 left-1/2 w-1 h-1 bg-cyan-400/40 rounded-full"
          animate={{ 
            y: [0, -6, 0],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-3 right-1/6 w-3 h-3 border border-blue-400/20 rounded-full"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-5 left-1/6 w-2 h-2 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-lg"
          animate={{ 
            rotate: [0, -360],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Subtle glow effects */}
        <motion.div
          className="absolute top-0 left-1/3 w-32 h-1 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"
          animate={{ 
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-24 h-1 bg-gradient-to-r from-transparent via-purple-400/10 to-transparent"
          animate={{ 
            opacity: [0, 0.4, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="flex items-center justify-between h-20"
          animate={{ 
            y: [0, -2, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Logo */}
          <motion.div
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
                  <Brain className="h-12 w-12 text-blue-600 group-hover:text-blue-700 transition-colors drop-shadow-lg" />
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
                  <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-purple-500" />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Star className="absolute -bottom-1 -left-1 h-4 w-4 text-yellow-500" />
                </motion.div>
              </div>
              <div className="flex flex-col">
                <motion.span 
                  className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
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
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
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
          </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {navItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
            <Link
                    href={item.href}
                    className="relative px-8 py-4 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 group overflow-hidden rounded-2xl"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    />
                    <div className="relative z-10 flex items-center space-x-3">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </motion.div>
                      <span className="font-semibold text-base">{item.label}</span>
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
            </Link>
                </motion.div>
              )
            })}

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
                className="ml-6 relative overflow-hidden group w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 hover:from-yellow-400/40 hover:to-orange-500/40 transition-all duration-300"
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
                <div className="relative w-6 h-6">
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
                    <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
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
                    <Moon className="h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
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
                      className="flex items-center space-x-3 ml-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/40 hover:to-purple-500/40 transition-all duration-300 rounded-full px-6 py-3 backdrop-blur-sm border border-white/20"
                    >
                      <motion.div 
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
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
                        <User className="h-5 w-5 text-white" />
                      </motion.div>
                      <span className="font-semibold text-gray-800 dark:text-white">{user.name}</span>
                      <motion.div
                        animate={{ 
                          rotate: [0, 180, 360],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Sparkles className="h-4 w-4 text-purple-500" />
                      </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50">
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
                className="flex items-center space-x-4 ml-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                <Link href="/auth/login">
                    <Button variant="ghost" className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors px-6 py-3 rounded-full font-semibold">
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
                    <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 rounded-full font-bold text-lg">
                      Sign Up
                    </Button>
                </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="lg:hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity rounded-lg" />
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          </motion.div>
        </motion.div>

        {/* Mobile Navigation */}
        <AnimatePresence>
        {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
                <div className="flex flex-col space-y-3">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        href={item.href} 
                        className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
              </Link>
                    </motion.div>
                  ))}
                  
              {user ? (
                <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Link 
                          href="/dashboard" 
                          className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                    Dashboard
                  </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                  <button
                          onClick={() => {
                            logout()
                            setIsOpen(false)
                          }}
                          className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  >
                    Logout
                  </button>
                      </motion.div>
                </>
              ) : (
                <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50"
                      >
                        <Link 
                          href="/auth/login" 
                          className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                    Login
                  </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Link 
                          href="/auth/signup" 
                          className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                          onClick={() => setIsOpen(false)}
                        >
                    Sign Up
                  </Link>
                      </motion.div>
                </>
              )}
            </div>
          </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
