"use client"

import type React from "react"
import { createContext, useContext } from "react"

// Create a mock context with default values
const BlockchainContext = createContext({
  account: "",
  chainId: 0,
  isConnected: false,
  connect: async () => {},
  disconnect: async () => {},
  switchNetwork: async () => {},
  provider: null,
  signer: null,
})

export const useBlockchain = () => useContext(BlockchainContext)

// Mock provider that returns default values
export function MockBlockchainProvider({ children }: { children: React.ReactNode }) {
  const mockValues = {
    account: "",
    chainId: 0,
    isConnected: false,
    connect: async () => {},
    disconnect: async () => {},
    switchNetwork: async () => {},
    provider: null,
    signer: null,
  }

  return <BlockchainContext.Provider value={mockValues}>{children}</BlockchainContext.Provider>
}

