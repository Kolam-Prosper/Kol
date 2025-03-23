"use client"

import type React from "react"

import { MockBlockchainProvider } from "@/context/mock-blockchain-context"
import ClientOnly from "@/components/client-only"

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <MockBlockchainProvider>{children}</MockBlockchainProvider>
    </ClientOnly>
  )
}

