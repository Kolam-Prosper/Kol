"use client"

import { useState } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Wallet } from "lucide-react"
import { MockUsdcFaucet } from "@/components/mock-usdc-faucet"

export default function DAppPage() {
  const { account, isConnected, connectWallet } = useBlockchain()
  const [activeTab, setActiveTab] = useState("overview")

  if (!isConnected) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="mb-8 relative w-32 h-32">
              <Image
                src="/placeholder.svg?height=128&width=128"
                alt="Kolam Logo"
                width={128}
                height={128}
                className="opacity-80"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Kolam Prosper DApp</h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl">
              Connect your wallet to access tokenized T-bonds, property deeds, staking, lending, and investment
              opportunities.
            </p>
            <Button size="lg" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kolam Prosper DApp</h1>
          <p className="text-muted-foreground">Tokenized Real-World Assets on Unichain</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="mr-4 text-right">
            <p className="text-sm text-muted-foreground">Connected as</p>
            <p className="font-medium">
              {account?.substring(0, 6)}...{account?.substring(38)}
            </p>
          </div>
          <div className="flex gap-2">
            <MockUsdcFaucet size="sm" />
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Wallet className="h-4 w-4" />
              Change
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="lending">Lending</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>Purchase T-Bonds and Property Deeds</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-primary opacity-80" />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dapp/marketplace" className="w-full">
                  <Button variant="default" className="w-full">
                    Visit Marketplace
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Assets</CardTitle>
                <CardDescription>Tokenized T-bonds and Property Deeds</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 flex items-center justify-center">
                  <p className="text-4xl font-bold">0</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dapp/assets" className="w-full">
                  <Button variant="default" className="w-full">
                    View Assets
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Staking</CardTitle>
                <CardDescription>Stake NFTs to earn AED LST tokens</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 flex items-center justify-center">
                  <p className="text-4xl font-bold">0</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dapp/staking" className="w-full">
                  <Button variant="default" className="w-full">
                    Stake Assets
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Lending</CardTitle>
                <CardDescription>Borrow against your assets</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 flex items-center justify-center">
                  <p className="text-4xl font-bold">0</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dapp/lending" className="w-full">
                  <Button variant="default" className="w-full">
                    Manage Loans
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Investments</CardTitle>
                <CardDescription>Invest in projects using AED LST</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 flex items-center justify-center">
                  <p className="text-4xl font-bold">0</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dapp/investments" className="w-full">
                  <Button variant="default" className="w-full">
                    Explore Projects
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>AED LST Balance</CardTitle>
                <CardDescription>Your liquid staking token balance</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-24 flex items-center justify-center">
                  <p className="text-4xl font-bold">0.00</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Transactions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketplace">
          <div className="flex justify-end mb-4">
            <Link href="/dapp/marketplace">
              <Button>Visit Marketplace</Button>
            </Link>
          </div>
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Purchase Tokenized Assets</h3>
            <p className="text-muted-foreground mb-6">
              Buy T-Bonds ($1,000) and Property Deed tokens ($100,000) using Mock USDC
            </p>
            <div className="flex justify-center">
              <Link href="/dapp/marketplace">
                <Button size="lg">Go to Marketplace</Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assets">
          <div className="flex justify-end mb-4">
            <Link href="/dapp/assets">
              <Button>View All Assets</Button>
            </Link>
          </div>
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Discover Tokenized Assets</h3>
            <p className="text-muted-foreground mb-6">Browse and purchase tokenized T-bonds and Property Deeds</p>
            <div className="flex justify-center">
              <Link href="/dapp/assets">
                <Button size="lg">Explore Assets</Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="staking">
          <div className="flex justify-end mb-4">
            <Link href="/dapp/staking">
              <Button>View Staking Dashboard</Button>
            </Link>
          </div>
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Stake Your Assets</h3>
            <p className="text-muted-foreground mb-6">Stake your NFTs to earn AED LST tokens</p>
            <div className="flex justify-center">
              <Link href="/dapp/staking">
                <Button size="lg">Start Staking</Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lending">
          <div className="flex justify-end mb-4">
            <Link href="/dapp/lending">
              <Button>View Lending Dashboard</Button>
            </Link>
          </div>
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Borrow Against Your Assets</h3>
            <p className="text-muted-foreground mb-6">Use your NFTs as collateral to get loans</p>
            <div className="flex justify-center">
              <Link href="/dapp/lending">
                <Button size="lg">Explore Lending</Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="investments">
          <div className="flex justify-end mb-4">
            <Link href="/dapp/investments">
              <Button>View All Projects</Button>
            </Link>
          </div>
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Invest in Projects</h3>
            <p className="text-muted-foreground mb-6">Use your AED LST tokens to invest in curated projects</p>
            <div className="flex justify-center">
              <Link href="/dapp/investments">
                <Button size="lg">Discover Opportunities</Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

