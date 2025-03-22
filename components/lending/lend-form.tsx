"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface LendFormProps {
  availableLiquidity: string
  onLend: (amount: string) => Promise<void>
}

export function LendForm({ availableLiquidity, onLend }: LendFormProps) {
  const [amount, setAmount] = useState<string>("1000")
  const [duration, setDuration] = useState<number>(3)

  // Estimated APY based on duration
  const getEstimatedApy = () => {
    switch (duration) {
      case 1:
        return "8-10%"
      case 3:
        return "10-12%"
      case 6:
        return "12-14%"
      case 9:
        return "14-16%"
      case 12:
        return "16-18%"
      case 18:
        return "18-20%"
      default:
        return "10-15%"
    }
  }

  // Calculate estimated earnings (simplified)
  const calculateEstimatedEarnings = () => {
    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum)) return { min: "0", max: "0" }

    let minRate, maxRate

    switch (duration) {
      case 1:
        minRate = 0.08
        maxRate = 0.1
        break
      case 3:
        minRate = 0.1
        maxRate = 0.12
        break
      case 6:
        minRate = 0.12
        maxRate = 0.14
        break
      case 9:
        minRate = 0.14
        maxRate = 0.16
        break
      case 12:
        minRate = 0.16
        maxRate = 0.18
        break
      case 18:
        minRate = 0.18
        maxRate = 0.2
        break
      default:
        minRate = 0.1
        maxRate = 0.15
    }

    // Adjust for duration (simplified)
    const minEarnings = amountNum * minRate * (duration / 12)
    const maxEarnings = amountNum * maxRate * (duration / 12)

    return {
      min: minEarnings.toFixed(2),
      max: maxEarnings.toFixed(2),
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleLend = async () => {
    if (Number.parseFloat(amount) <= 0) return

    await onLend(amount)
  }

  const earnings = calculateEstimatedEarnings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lend to the Pool</CardTitle>
        <CardDescription>Provide liquidity to the lending pool and earn interest</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="lend-amount">Amount to Lend (AED)</Label>
          <Input id="lend-amount" type="number" value={amount} onChange={handleAmountChange} min="100" step="100" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Lending Duration</Label>
            <span className="text-sm font-medium">{duration} months</span>
          </div>
          <RadioGroup
            value={duration.toString()}
            onValueChange={(value) => setDuration(Number.parseInt(value))}
            className="grid grid-cols-3 gap-2"
          >
            {[1, 3, 6, 9, 12, 18].map((months) => (
              <div key={months} className="flex items-center space-x-2">
                <RadioGroupItem value={months.toString()} id={`lend-duration-${months}`} />
                <Label htmlFor={`lend-duration-${months}`} className="cursor-pointer">
                  {months} {months === 1 ? "month" : "months"}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Current Pool Liquidity</span>
            <span className="font-medium">{Number.parseFloat(availableLiquidity).toLocaleString()} AED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Estimated APY</span>
            <span className="font-medium text-primary">{getEstimatedApy()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Estimated Earnings (min)</span>
            <span className="font-medium">{Number.parseFloat(earnings.min).toLocaleString()} AED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-400">Estimated Earnings (max)</span>
            <span className="font-medium">{Number.parseFloat(earnings.max).toLocaleString()} AED</span>
          </div>
        </div>

        <div className="p-3 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">
            Earnings vary based on borrower activity. More borrowers = higher returns for lenders. Funds can be
            withdrawn after the lending period ends.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleLend} disabled={Number.parseFloat(amount) <= 0}>
          Lend Now
        </Button>
      </CardFooter>
    </Card>
  )
}

