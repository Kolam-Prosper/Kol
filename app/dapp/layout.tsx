import type React from "react"
import { DappNavigation } from "@/components/dapp-navigation"
import { BlockchainProvider } from "@/context/blockchain-context"

export default function DAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BlockchainProvider>
      <DappNavigation>{children}</DappNavigation>
    </BlockchainProvider>
  )
}

