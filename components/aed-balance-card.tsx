"use client"

import { useState } from "react"
import { useStaking } from "@/hooks/use-staking"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AedBalanceCard() {
  const { aedBalance, aedPrice, transferAed, isLoading } = useStaking()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [showTransfer, setShowTransfer] = useState(false)

  const handleTransfer = async () => {
    if (!recipient || !amount || Number.parseFloat(amount) <= 0) {
      return
    }

    if (Number.parseFloat(amount) > Number.parseFloat(aedBalance)) {
      return
    }

    await transferAed(recipient, amount)
    setRecipient("")
    setAmount("")
    setShowTransfer(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AED LST Balance</CardTitle>
        <CardDescription>Your AED LST token balance and value</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Balance:</span>
          <span className="text-2xl font-bold">{Number.parseFloat(aedBalance).toFixed(2)} AED</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Price:</span>
          <span className="font-medium">${Number.parseFloat(aedPrice).toFixed(4)} USD</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Value:</span>
          <span className="font-medium">
            ${(Number.parseFloat(aedBalance) * Number.parseFloat(aedPrice)).toFixed(2)} USD
          </span>
        </div>

        {showTransfer ? (
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Available: {Number.parseFloat(aedBalance).toFixed(2)} AED</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleTransfer}
                disabled={
                  isLoading ||
                  !recipient ||
                  !amount ||
                  Number.parseFloat(amount) <= 0 ||
                  Number.parseFloat(amount) > Number.parseFloat(aedBalance)
                }
                className="flex-1"
              >
                {isLoading ? "Transferring..." : "Transfer"}
              </Button>
              <Button variant="outline" onClick={() => setShowTransfer(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setShowTransfer(true)} className="w-full">
            Transfer AED
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

