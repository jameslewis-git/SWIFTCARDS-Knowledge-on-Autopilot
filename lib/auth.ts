import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "./mongodb"
import { User } from "@/models/User"

export async function getUserFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return null
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }

    await connectDB()

    // Find user by ID
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return null
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}
