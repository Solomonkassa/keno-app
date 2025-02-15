import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { User } from "@/models/User"

const TOTAL_NUMBERS = 80
const DRAW_COUNT = 20

// Payout table (simplified for this example)
const PAYOUT_TABLE = {
  1: [0, 2],
  2: [0, 0, 2],
  3: [0, 0, 2, 5],
  4: [0, 0, 2, 5, 10],
  5: [0, 0, 2, 5, 10, 50],
  // Add more payout rows as needed
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { selectedNumbers, betAmount } = await req.json()

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user || user.balance < betAmount) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 })
    }

    // Generate drawn numbers
    const drawnNumbers = []
    while (drawnNumbers.length < DRAW_COUNT) {
      const num = Math.floor(Math.random() * TOTAL_NUMBERS) + 1
      if (!drawnNumbers.includes(num)) {
        drawnNumbers.push(num)
      }
    }

    // Calculate matches and payout
    const matches = selectedNumbers.filter((n) => drawnNumbers.includes(n)).length
    const payoutRow = PAYOUT_TABLE[selectedNumbers.length as keyof typeof PAYOUT_TABLE] || []
    const multiplier = payoutRow[matches] || 0
    const payout = betAmount * multiplier

    // Update user balance
    user.balance = user.balance - betAmount + payout
    await user.save()

    return NextResponse.json({ drawnNumbers, payout }, { status: 200 })
  } catch (error) {
    console.error("Play error:", error)
    return NextResponse.json({ message: "An error occurred while playing" }, { status: 500 })
  }
}

