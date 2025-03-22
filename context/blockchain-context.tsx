"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { ethers } from "ethers"

interface BlockchainContextType {
  provider: ethers.providers.Web3Provider | null
  signer: ethers.providers.JsonRpcSigner | null
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connectWallet: (providerId?: string) => Promise<boolean>
  disconnectWallet: () => void
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

  const shortenAddress = (address: string, chars = 4): string => {
    if (!address) return ""
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
  }

  const connectWallet = async (providerId?: string) => {
    try {
      setIsConnecting(true)

      if (!window.ethereum) {
        console.error("No Ethereum provider found. Please install MetaMask.")
        alert("No Ethereum provider found. Please install MetaMask.")
        return false
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      // Get the connected chain ID
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      // Check if we're on the correct network (Unichain Sepolia Testnet - 1301)
      if (chainId !== "0x515") {
        // 0x515 is hex for 1301
        try {
          // Try to switch to the correct network
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x515" }],
          })
        } catch (switchError: any) {
          // If the network is not added to MetaMask, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x515",
                  chainName: "Unichain Sepolia Testnet",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://sepolia.unichain.org"],
                  blockExplorerUrls: ["https://sepolia.uniscan.xyz/"],
                },
              ],
            })
          } else {
            throw switchError
          }
        }
      }

      // Get the provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const address = await signer.getAddress()

      setProvider(provider)
      setSigner(signer)
      setAddress(address)
      setIsConnected(true)

      // Save connection state to localStorage
      localStorage.setItem("walletConnected", "true")

      console.log(`Wallet connected: ${shortenAddress(address)}`)
      return true
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      alert(`Failed to connect wallet: ${error.message || "Unknown error"}`)
      return false
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setProvider(null)
    setSigner(null)
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem("walletConnected")
    console.log("Wallet disconnected")
  }

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (localStorage.getItem("walletConnected") === "true" && window.ethereum) {
        try {
          setIsConnecting(true)
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const address = await signer.getAddress()

          // Get the connected chain ID
          const chainId = await window.ethereum.request({ method: "eth_chainId" })

          // Check if we're on the correct network (Unichain Sepolia Testnet - 1301)
          if (chainId !== "0x515") {
            // 0x515 is hex for 1301
            alert("Please switch to Unichain Sepolia Testnet.")
            disconnectWallet()
            return
          }

          setProvider(provider)
          setSigner(signer)
          setAddress(address)
          setIsConnected(true)
          console.log(`Wallet connected: ${shortenAddress(address)}`)
        } catch (error) {
          console.error("Error reconnecting wallet:", error)
          disconnectWallet()
        } finally {
          setIsConnecting(false)
        }
      }
    }

    checkWalletConnection()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          connectWallet()
        }
      })

      window.ethereum.on("chainChanged", (_chainId: string) => {
        // Handle chain ID change
        if (_chainId !== "0x515") {
          alert("Please switch to Unichain Sepolia Testnet.")
          disconnectWallet()
        } else {
          connectWallet()
        }
      })
    }

    // Cleanup function to remove listeners when the component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [])

  const value: BlockchainContextType = {
    provider,
    signer,
    address,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  }

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>
}

export const useBlockchain = () => {
  const context = useContext(BlockchainContext)
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider")
  }
  return context
}

