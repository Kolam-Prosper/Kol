"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { CHAIN_CONFIG } from "@/config/contracts"
import { useToast } from "@/hooks/use-toast"

export function useWallet() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: "No Ethereum Wallet Found",
        description: "Please install MetaMask or another Ethereum wallet.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConnecting(true)

      // Request account access
      const browserProvider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await browserProvider.send("eth_requestAccounts", [])

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const connectedSigner = await browserProvider.getSigner()
      const connectedChainId = (await browserProvider.getNetwork()).chainId

      setProvider(browserProvider)
      setSigner(connectedSigner)
      setAccount(accounts[0])
      setChainId(Number(connectedChainId))
      setIsConnected(true)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
      })

      // Check if on the correct network
      if (Number(connectedChainId) !== CHAIN_CONFIG.chainId) {
        switchToUnichainSepolia()
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }, [toast])

  const switchToUnichainSepolia = useCallback(async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CHAIN_CONFIG.chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${CHAIN_CONFIG.chainId.toString(16)}`,
                chainName: CHAIN_CONFIG.chainName,
                nativeCurrency: CHAIN_CONFIG.nativeCurrency,
                rpcUrls: CHAIN_CONFIG.rpcUrls,
                blockExplorerUrls: CHAIN_CONFIG.blockExplorerUrls,
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding Unichain Sepolia network:", addError)
        }
      }
      console.error("Error switching to Unichain Sepolia:", switchError)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setProvider(null)
    setSigner(null)
    setAccount(null)
    setChainId(null)
    setIsConnected(false)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }, [toast])

  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== account) {
        setAccount(accounts[0])
        toast({
          title: "Account Changed",
          description: `Switched to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`,
        })
      }
    }

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = Number.parseInt(chainIdHex, 16)
      setChainId(newChainId)

      if (newChainId !== CHAIN_CONFIG.chainId) {
        toast({
          title: "Network Changed",
          description: "Please switch to Unichain Sepolia Testnet for this application.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Network Changed",
          description: "Connected to Unichain Sepolia Testnet",
        })
      }
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [account, disconnectWallet, toast])

  return {
    provider,
    signer,
    account,
    chainId,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchToUnichainSepolia,
  }
}

