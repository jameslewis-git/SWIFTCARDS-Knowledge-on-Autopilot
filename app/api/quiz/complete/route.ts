import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/models/User"
import { getUserFromToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { results, totalTime, xpEarned } = await request.json()

    await connectDB()

    // Update user XP and level
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      {
        $inc: { xp: xpEarned },
        $set: { lastLogin: new Date() },
      },
      { new: true },
    )

    // Calculate new level (every 1000 XP = 1 level)
    const newLevel = Math.floor(updatedUser.xp / 1000) + 1
    if (newLevel > updatedUser.level) {
      updatedUser.level = newLevel
      await updatedUser.save()
    }

    // Award badges based on performance
    const correctAnswers = results.filter((r: any) => r.isCorrect).length
    const accuracy = (correctAnswers / results.length) * 100

    const newBadges = []
    if (accuracy === 100 && !updatedUser.badges.includes("Perfect Score")) {
      newBadges.push("Perfect Score")
    }
    if (correctAnswers >= 10 && !updatedUser.badges.includes("Quiz Master")) {
      newBadges.push("Quiz Master")
    }
    if (accuracy >= 90 && !updatedUser.badges.includes("High Achiever")) {
      newBadges.push("High Achiever")
    }

    if (newBadges.length > 0) {
      updatedUser.badges.push(...newBadges)
      await updatedUser.save()
    }

    return NextResponse.json({
      message: "Quiz completed successfully",
      xpEarned,
      newLevel: updatedUser.level,
      newBadges,
      totalXP: updatedUser.xp,
    })
  } catch (error) {
    console.error("Quiz completion error:", error)
    return NextResponse.json({ error: "Failed to complete quiz" }, { status: 500 })
  }
}
