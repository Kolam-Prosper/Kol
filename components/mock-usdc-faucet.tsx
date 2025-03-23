"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"
import { useBlockchain } from "@/context/blockchain-context"

interface MockUsdcFaucetProps {
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function MockUsdcFaucet({ variant = "outline", size = "default", className }: MockUsdcFaucetProps) {
  const [showFaucet, setShowFaucet] = useState(false)
  const { account } = useBlockchain()

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setShowFaucet(true)} className={className}>
        Get Mock USDC
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>

      <Dialog open={showFaucet} onOpenChange={setShowFaucet}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Mock USDC Faucet</DialogTitle>
            <DialogDescription>Get Mock USDC tokens for testing the platform.</DialogDescription>
          </DialogHeader>
          <div className="h-[600px] w-full">
            <iframe src="https://mockfaucet.vercel.app/" className="w-full h-full border-0" title="Mock USDC Faucet" />
          </div>
          <DialogFooter>
            <Button onClick={() => setShowFaucet(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

