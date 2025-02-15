"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useSession } from "next-auth/react"

const TOTAL_NUMBERS = 80
const MAX_SELECTED = 15
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

export function KenoGame() {
  const { data: session } = useSession()
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [betAmount, setBetAmount] = useState(1)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    // Fetch user balance
    const fetchBalance = async () => {
      const res = await fetch("/api/balance")
      if (res.ok) {
        const data = await res.json()
        setBalance(data.balance)
      }
    }

    if (session) {
      fetchBalance()
    }
  }, [session])

  const toggleNumber = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number))
    } else if (selectedNumbers.length < MAX_SELECTED) {
      setSelectedNumbers([...selectedNumbers, number])
    }
  }

  const startDraw = async () => {
    if (selectedNumbers.length === 0) {
      alert("Please select at least one number")
      return
    }

    if (betAmount > balance) {
      alert("Insufficient balance")
      return
    }

    setIsDrawing(true)
    setDrawnNumbers([])
    setResult(null)

    try {
      const res = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedNumbers, betAmount }),
      })

      if (res.ok) {
        const data = await res.json()
        animateDraw(data.drawnNumbers, data.payout)
      } else {
        throw new Error("Failed to play")
      }
    } catch (error) {
      setIsDrawing(false)
      setResult("An error occurred. Please try again.")
    }
  }

  const animateDraw = (numbers: number[], payout: number) => {
    let index = 0
    const drawInterval = setInterval(() => {
      setDrawnNumbers((prev) => [...prev, numbers[index]])
      index++

      if (index === DRAW_COUNT) {
        clearInterval(drawInterval)
        setIsDrawing(false)
        const matches = selectedNumbers.filter((n) => numbers.includes(n)).length
        setResult(`You matched ${matches} number${matches !== 1 ? "s" : ""}! Payout: $${payout.toFixed(2)}`)
        setBalance((prev) => prev - betAmount + payout)
      }
    }, 200)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Keno Game</h2>
      <div className="flex justify-between items-center mb-4">
        <p>Balance: ${balance.toFixed(2)}</p>
        <div className="flex items-center space-x-2">
          <Label htmlFor="betAmount">Bet Amount: $</Label>
          <Input
            id="betAmount"
            type="number"
            min="1"
            max={balance}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="w-20"
          />
        </div>
      </div>
      <div className="grid grid-cols-10 gap-2 mb-4">
        {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map((number) => (
          <Button
            key={number}
            onClick={() => toggleNumber(number)}
            variant={selectedNumbers.includes(number) ? "default" : "outline"}
            className={`h-10 w-10 ${drawnNumbers.includes(number) ? "bg-green-500 text-white" : ""}`}
            disabled={isDrawing}
          >
            {number}
          </Button>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <p>
          Selected: {selectedNumbers.length}/{MAX_SELECTED}
        </p>
        <Button onClick={startDraw} disabled={isDrawing || selectedNumbers.length === 0 || betAmount > balance}>
          {isDrawing ? "Drawing..." : "Start Draw"}
        </Button>
      </div>
      {result && <p className="text-xl font-bold text-center">{result}</p>}
    </div>
  )
}

