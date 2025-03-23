"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { useContracts } from "@/hooks/use-contracts"

interface BlockchainContextType {
  // Wallet
  account: string | null
  chainId: number | null
  isConnecting: boolean
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void

  // Contracts
  tBonds: any
  propertyDeeds: any
  projectFactory: any
  aedLst: any
  nftStakingVault: any
  lendingVault: any
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const { account, chainId, isConnecting, isConnected, connectWallet, disconnectWallet } = useWallet()

  const { tBonds, propertyDeeds, projectFactory, aedLst, nftStakingVault, lendingVault } = useContracts()

  return (
    <BlockchainContext.Provider
      value={{
        account,
        chainId,
        isConnecting,
        isConnected,
        connectWallet,
        disconnectWallet,
        tBonds,
        propertyDeeds,
        projectFactory,
        aedLst,
        nftStakingVault,
        lendingVault,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
}

export function useBlockchain() {
  const context = useContext(BlockchainContext)
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider")
  }
  return context
}

