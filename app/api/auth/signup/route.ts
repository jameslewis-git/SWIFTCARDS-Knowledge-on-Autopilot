import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      xp: 0,
      level: 1,
      badges: [],
      createdAt: new Date(),
    })

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    // Create response with user data (excluding password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      xp: user.xp,
      level: user.level,
      badges: user.badges,
    }

    const response = NextResponse.json(userData)

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
