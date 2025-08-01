import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }

    await connectDB()

    // Find user by ID
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
