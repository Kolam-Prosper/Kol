"use client"

import { useState } from "react"
import { ConnectWalletModal } from "@/components/connect-wallet-modal"
import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export default function LaunchAppPage() {
  const [showConnectModal, setShowConnectModal] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <ConnectWalletModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">Kolam Prosper</span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Connect your wallet to access the platform and start managing your tokenized assets.
          </p>

          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur-lg opacity-70 group-hover:opacity-100 transition duration-1000"></div>
            <Button
              size="lg"
              className="relative text-lg px-8 py-6 bg-black hover:bg-black/90 border border-primary/50 group"
              onClick={() => setShowConnectModal(true)}
            >
              <span className="mr-2">Connect Wallet</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <p className="mt-8 text-sm text-gray-400">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>

      <footer className="p-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Kolam Prosper. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}