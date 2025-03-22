"use client"

import { useState } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { useStaking } from "@/hooks/use-staking"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StakeNFTForm } from "@/components/stake-nft-form"
import { StakedNFTsList } from "@/components/staked-nfts-list"
import { AedBalanceCard } from "@/components/aed-balance-card"

export default function StakingDashboard() {
  const { isConnected, connectWallet } = useBlockchain()
  const { aedBalance, aedPrice } = useStaking()
  const [activeTab, setActiveTab] = useState("staked")

  if (!isConnected) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Connect your wallet to access the Kolam Prosper staking dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={connectWallet} className="w-full">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Staking Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AED LST Overview</CardTitle>
            <CardDescription>Your AED LST token information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">{Number.parseFloat(aedBalance).toFixed(2)} AED</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Value</p>
                <p className="text-2xl font-bold">
                  ${(Number.parseFloat(aedBalance) * Number.parseFloat(aedPrice)).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <AedBalanceCard />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="staked">Your Staked NFTs</TabsTrigger>
          <TabsTrigger value="stake">Stake NFT</TabsTrigger>
        </TabsList>

        <TabsContent value="staked">
          <StakedNFTsList />
        </TabsContent>

        <TabsContent value="stake">
          <StakeNFTForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

