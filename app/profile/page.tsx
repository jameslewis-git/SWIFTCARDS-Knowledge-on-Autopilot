"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Settings, 
  Trophy, 
  BookOpen, 
  Target, 
  Calendar,
  Edit3,
  Save,
  X,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Download
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { GalaxyBackground } from "@/components/ui/galaxy-background"
import { useTheme } from "next-themes"

export default function ProfilePage() {
  const { user } = useAuth()
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || ""
  })

  const stats = [
    { label: "Total Decks", value: "12", icon: <BookOpen className="h-4 w-4" /> },
    { label: "Cards Studied", value: "1,247", icon: <Target className="h-4 w-4" /> },
    { label: "Study Streak", value: "7 days", icon: <Calendar className="h-4 w-4" /> },
    { label: "Accuracy", value: "87%", icon: <Trophy className="h-4 w-4" /> }
  ]

  const badges = [
    { name: "First Steps", description: "Created your first deck", earned: true },
    { name: "Study Streak", description: "Studied for 7 days in a row", earned: true },
    { name: "Perfect Score", description: "Got 100% on a quiz", earned: true },
    { name: "AI Master", description: "Generated 50 AI flashcards", earned: false },
    { name: "Collaborator", description: "Shared a deck with someone", earned: false },
    { name: "Night Owl", description: "Studied after 10 PM", earned: false }
  ]

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || ""
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Galaxy Background */}
        <div className="absolute inset-0 z-0">
          <GalaxyBackground />
        </div>
        
        {/* Content */}
        <div className="relative z-10 pt-32">
          <Card className={`w-full max-w-md backdrop-blur-sm ${
            isDark 
              ? 'bg-white/10 border border-white/20' 
              : 'bg-white/80 border border-gray-200/50'
          }`}>
            <CardContent className="p-6">
              <p className={`text-center ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                Please log in to view your profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Galaxy Background */}
      <div className="absolute inset-0 z-0">
        <GalaxyBackground />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Profile
          </h1>
          <p className={isDark ? 'text-gray-200' : 'text-gray-600'}>
            Manage your account and view your learning progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className={`backdrop-blur-sm ${
              isDark 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/80 border border-gray-200/50'
            }`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className={`text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {user.name}
                </CardTitle>
                <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                  {user.email}
                </CardDescription>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary" className={
                    isDark 
                      ? 'bg-white/20 border border-white/30 text-white' 
                      : 'bg-gray-100/80 border border-gray-200/50 text-gray-700'
                  }>
                    Level {user.level}
                  </Badge>
                  <Badge variant="outline" className={
                    isDark 
                      ? 'border-white/30 text-white' 
                      : 'border-gray-300 text-gray-700'
                  }>
                    {user.xp} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Member since
                    </span>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      January 2024
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Account status
                    </span>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <Card key={index} className={`backdrop-blur-sm ${
                      isDark 
                        ? 'bg-white/10 border border-white/20' 
                        : 'bg-white/80 border border-gray-200/50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {stat.label}
                            </p>
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                              {stat.value}
                            </p>
                          </div>
                          <div className={isDark ? 'text-blue-400' : 'text-blue-600'}>
                            {stat.icon}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity */}
                <Card className={`backdrop-blur-sm ${
                  isDark 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/80 border border-gray-200/50'
                }`}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>
                      Recent Activity
                    </CardTitle>
                    <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      Your latest study sessions and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          isDark 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          <Trophy className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Completed Biology Quiz
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Score: 95% • 2 hours ago
                          </p>
                        </div>
                      </div>
                      <Separator className={isDark ? 'bg-white/20' : 'bg-gray-200'} />
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          isDark 
                            ? 'bg-blue-900/30 text-blue-400' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Created "Chemistry Basics" Deck
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            15 cards • 1 day ago
                          </p>
                        </div>
                      </div>
                      <Separator className={isDark ? 'bg-white/20' : 'bg-gray-200'} />
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          isDark 
                            ? 'bg-purple-900/30 text-purple-400' 
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          <Target className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Studied Math Flashcards
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            30 minutes • 2 days ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className={`backdrop-blur-sm ${
                  isDark 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/80 border border-gray-200/50'
                }`}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>
                      Account Settings
                    </CardTitle>
                    <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className={isDark ? 'text-white' : 'text-gray-700'}>
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                          className={isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className={isDark ? 'text-white' : 'text-gray-700'}>
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                          className={isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}
                        />
                      </div>
                      <div>
                        <Label htmlFor="avatar" className={isDark ? 'text-white' : 'text-gray-700'}>
                          Avatar URL
                        </Label>
                        <Input
                          id="avatar"
                          value={formData.avatar}
                          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                          disabled={!isEditing}
                          placeholder="https://example.com/avatar.jpg"
                          className={isDark ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400' : ''}
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                          <Edit3 className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      ) : (
                        <>
                          <Button onClick={handleSave} className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className={`backdrop-blur-sm ${
                  isDark 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/80 border border-gray-200/50'
                }`}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>
                      Preferences
                    </CardTitle>
                    <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      Customize your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className={isDark ? 'text-white' : 'text-gray-800'}>Study Reminders</span>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span className={isDark ? 'text-white' : 'text-gray-800'}>Dark Mode</span>
                      </div>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className={isDark ? 'text-white' : 'text-gray-800'}>Language</span>
                      </div>
                      <Button variant="outline" size="sm">English</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <Card className={`backdrop-blur-sm ${
                  isDark 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/80 border border-gray-200/50'
                }`}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>
                      Achievements & Badges
                    </CardTitle>
                    <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      Track your learning milestones and accomplishments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {badges.map((badge, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border backdrop-blur-sm ${
                            badge.earned
                              ? isDark 
                                ? 'bg-green-900/20 border-green-800' 
                                : 'bg-green-50 border-green-200'
                              : isDark 
                                ? 'bg-gray-800/50 border-gray-700' 
                                : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              badge.earned
                                ? isDark 
                                  ? 'bg-green-900/30 text-green-400' 
                                  : 'bg-green-100 text-green-600'
                                : isDark 
                                  ? 'bg-gray-700 text-gray-400' 
                                  : 'bg-gray-100 text-gray-400'
                            }`}>
                              <Trophy className="h-4 w-4" />
                            </div>
                            <div>
                              <p className={`font-medium ${
                                badge.earned 
                                  ? isDark 
                                    ? 'text-green-200' 
                                    : 'text-green-800'
                                  : isDark 
                                    ? 'text-gray-400' 
                                    : 'text-gray-500'
                              }`}>
                                {badge.name}
                              </p>
                              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                {badge.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-6">
                <Card className={`backdrop-blur-sm ${
                  isDark 
                    ? 'bg-white/10 border border-white/20' 
                    : 'bg-white/80 border border-gray-200/50'
                }`}>
                  <CardHeader>
                    <CardTitle className={isDark ? 'text-white' : 'text-gray-800'}>
                      Export Your Data
                    </CardTitle>
                    <CardDescription className={isDark ? 'text-gray-200' : 'text-gray-600'}>
                      Download your flashcards and study data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className={`flex items-center justify-between p-4 border rounded-lg ${
                      isDark 
                        ? 'border-white/20' 
                        : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Export All Flashcards
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Download all your decks as CSV or Anki format
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Export</Button>
                    </div>
                    <div className={`flex items-center justify-between p-4 border rounded-lg ${
                      isDark 
                        ? 'border-white/20' 
                        : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            Study Statistics
                          </p>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Download your learning progress and analytics
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Download</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
} 