"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/context/wallet-context"
import { Loader2, AlertTriangle } from "lucide-react"

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connect, isConnecting, isConnected, error } = useWallet()
  const { toast } = useToast()
  const router = useRouter()
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMetaMaskInstalled(!!window.ethereum)
    }
  }, [])

  useEffect(() => {
    if (isConnected) {
      toast({
        title: "Wallet connected",
        description: "You have successfully connected your wallet",
      })
      router.push("/dashboard")
      onClose()
    }
  }, [isConnected, onClose, router, toast])

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error("Connection error:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-gray-400">
            Connect your wallet to access the Kolam Prosper platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isMetaMaskInstalled ? (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-500">MetaMask not detected</h4>
                <p className="text-sm text-gray-300 mt-1">Please install MetaMask to connect to the platform.</p>
                <Button
                  variant="outline"
                  className="mt-3 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10"
                  onClick={() => window.open("https://metamask.io/download/", "_blank")}
                >
                  Install MetaMask
                </Button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-500">Connection Error</h4>
                    <p className="text-sm text-gray-300 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 rounded-lg p-5 flex flex-col items-center justify-center">
                <img src="/placeholder.svg?height=80&width=80" alt="MetaMask" className="h-16 w-16 mb-4" />
                <h3 className="font-medium text-lg mb-1">MetaMask</h3>
                <p className="text-sm text-gray-400 text-center mb-4">
                  Connect to your MetaMask wallet to access the platform
                </p>
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-medium"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect MetaMask"
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                By connecting your wallet, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

