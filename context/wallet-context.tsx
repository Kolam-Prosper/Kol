// context/wallet-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"

interface WalletContextType {
  address: string | null
  balance: string | null
  chainId: number | null
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  error: string | null
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  balance: null,
  chainId: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  error: null,
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)

  // Initialize provider
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
    }
  }, [])

  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (provider) {
        try {
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            const address = accounts[0].address
            setAddress(address)

            const network = await provider.getNetwork()
            setChainId(Number(network.chainId))

            const balance = await provider.getBalance(address)
            setBalance(ethers.formatEther(balance).slice(0, 6))

            setIsConnected(true)
          }
        } catch (error) {
          console.error("Failed to check connection:", error)
        }
      }
    }

    checkConnection()
  }, [provider])

  // Handle account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnect()
        } else if (accounts[0] !== address) {
          // Account changed
          setAddress(accounts[0])
          updateBalance(accounts[0])
        }
      }

      const handleChainChanged = (chainId: string) => {
        setChainId(Number.parseInt(chainId, 16))
        // Reload the page to avoid any state inconsistency
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [address])

  const updateBalance = async (address: string) => {
    if (provider && address) {
      try {
        const balance = await provider.getBalance(address)
        setBalance(ethers.formatEther(balance).slice(0, 6))
      } catch (error) {
        console.error("Failed to get balance:", error)
      }
    }
  }

  const connect = async () => {
    if (!provider) {
      setError("No Ethereum wallet found. Please install MetaMask.")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Use window.ethereum directly for the request
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const address = accounts[0]
        setAddress(address)

        const network = await provider.getNetwork()
        setChainId(Number(network.chainId))

        const balance = await provider.getBalance(address)
        setBalance(ethers.formatEther(balance).slice(0, 6))

        setIsConnected(true)

        // Check if on the correct network (Unichain Sepolia Testnet)
        if (Number(network.chainId) !== 1301) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x515" }], // 1301 in hex
            })
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              try {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x515", // 1301 in hex
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
              } catch (addError) {
                console.error("Failed to add network:", addError)
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Failed to connect:", error)
      setError(error.message || "Failed to connect to wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setBalance(null)
    setChainId(null)
    setIsConnected(false)
    // Note: There's no actual "disconnect" method in MetaMask
    // This just clears the state in our app
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        chainId,
        isConnecting,
        isConnected,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}