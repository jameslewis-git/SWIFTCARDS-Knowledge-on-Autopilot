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

export default function ProfilePage() {
  const { user } = useAuth()
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
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account and view your learning progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary">Level {user.level}</Badge>
                  <Badge variant="outline">{user.xp} XP</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Member since</span>
                    <span className="text-sm font-medium">January 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Account status</span>
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
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </div>
                          <div className="text-blue-600 dark:text-blue-400">
                            {stat.icon}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest study sessions and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Completed Biology Quiz</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Score: 95% • 2 hours ago</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Created "Chemistry Basics" Deck</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">15 cards • 1 day ago</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Studied Math Flashcards</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">30 minutes • 2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Update your personal information and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                          id="avatar"
                          value={formData.avatar}
                          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                          disabled={!isEditing}
                          placeholder="https://example.com/avatar.jpg"
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

                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your learning experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span>Study Reminders</span>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span>Dark Mode</span>
                      </div>
                      <Button variant="outline" size="sm">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Language</span>
                      </div>
                      <Button variant="outline" size="sm">English</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Badges</CardTitle>
                    <CardDescription>Track your learning milestones and accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {badges.map((badge, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            badge.earned
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              badge.earned
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                            }`}>
                              <Trophy className="h-4 w-4" />
                            </div>
                            <div>
                              <p className={`font-medium ${
                                badge.earned ? 'text-green-800 dark:text-green-200' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {badge.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
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
                <Card>
                  <CardHeader>
                    <CardTitle>Export Your Data</CardTitle>
                    <CardDescription>Download your flashcards and study data</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Export All Flashcards</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Download all your decks as CSV or Anki format</p>
                        </div>
                      </div>
                      <Button variant="outline">Export</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Study Statistics</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Download your learning progress and analytics</p>
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