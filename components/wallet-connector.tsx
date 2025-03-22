"use client"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"

export function WalletConnector() {
  const { isConnected, address, connectWallet, disconnectWallet } = useBlockchain()
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)

  useEffect(() => {
    setIsMetaMaskInstalled(typeof window !== "undefined" && !!window.ethereum)
  }, [])

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    await connectWallet("metamask")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Connect Your Wallet</h2>
          <button
            onClick={() => document.querySelector(".fixed")?.remove()}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Connect your wallet to access the Kolam Prosper platform
        </p>

        <button
          onClick={handleConnect}
          className="flex items-center justify-center gap-3 w-full p-3 border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 212 189" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60.7076 173.144L30.2576 160.621V172.663L60.7076 187.144V173.144Z" fill="#CDBDB2" />
              <path d="M181.258 173.144V187.144L211.708 172.663V160.621L181.258 173.144Z" fill="#CDBDB2" />
              <path d="M60.7076 131.144L30.2576 143.667V173.144L60.7076 160.621V131.144Z" fill="#393939" />
              <path d="M181.258 131.144V160.621L211.708 173.144V143.667L181.258 131.144Z" fill="#393939" />
              <path d="M60.7076 131.144L90.6743 109.144L60.7076 90.6211V131.144Z" fill="#F89C35" />
              <path d="M151.291 131.144V90.6211L121.324 109.144L151.291 131.144Z" fill="#F89C35" />
              <path d="M60.7076 90.6211L90.6743 109.144V65.6211L60.7076 90.6211Z" fill="#F89D35" />
              <path d="M151.291 90.6211L121.324 65.6211V109.144L151.291 90.6211Z" fill="#F89D35" />
              <path d="M90.6743 65.6211L60.7076 90.6211V37.6211L90.6743 65.6211Z" fill="#F89D35" />
              <path d="M121.324 65.6211L151.291 37.6211V90.6211L121.324 65.6211Z" fill="#F89D35" />
              <path d="M60.7076 37.6211L90.6743 1.14453V65.6211L60.7076 37.6211Z" fill="#F89D35" />
              <path d="M121.324 65.6211V1.14453L151.291 37.6211L121.324 65.6211Z" fill="#F89D35" />
              <path d="M90.6743 109.144L60.7076 131.144V173.144L90.6743 151.144V109.144Z" fill="#D87C30" />
              <path d="M121.324 109.144V151.144L151.291 173.144V131.144L121.324 109.144Z" fill="#D87C30" />
              <path d="M151.291 173.144L121.324 151.144V187.144L151.291 173.144Z" fill="#EA8D3A" />
              <path d="M60.7076 173.144L90.6743 187.144V151.144L60.7076 173.144Z" fill="#EA8D3A" />
              <path d="M121.324 109.144L90.6743 87.1445V151.144L121.324 109.144Z" fill="#F89D35" />
              <path d="M90.6743 109.144L121.324 87.1445V151.144L90.6743 109.144Z" fill="#EB8F35" />
              <path d="M90.6743 65.6211L121.324 37.6211L90.6743 1.14453V65.6211Z" fill="#E8821E" />
              <path d="M90.6743 65.6211L121.324 65.6211V37.6211L90.6743 65.6211Z" fill="#DFCEC3" />
              <path d="M60.7076 90.6211L90.6743 65.6211L60.7076 37.6211V90.6211Z" fill="#E8821E" />
              <path d="M121.324 65.6211L151.291 90.6211V37.6211L121.324 65.6211Z" fill="#E8821E" />
              <path d="M151.291 90.6211L121.324 109.144L151.291 131.144V90.6211Z" fill="#E8821E" />
              <path d="M90.6743 109.144L60.7076 90.6211V131.144L90.6743 109.144Z" fill="#E8821E" />
            </svg>
          </div>
          <div className="text-left">
            <span className="font-medium">MetaMask</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Connect to your MetaMask wallet</p>
          </div>
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

