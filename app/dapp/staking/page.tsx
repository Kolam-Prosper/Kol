"use client"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, Wallet } from "lucide-react"
import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "@/config/contracts"
import NftStakingVaultABI from "@/abis/NftStakingVault.json"

// Define asset types
interface Asset {
  id: string
  type: "tbond" | "property"
  contractAddress: string
  name: string
  value: string
  image: string
  selected: boolean
}

// Define duration options with their reward percentages
const durationOptions = [
  { value: "1", label: "1 Month", percentage: 10 },
  { value: "3", label: "3 Months", percentage: 20 },
  { value: "6", label: "6 Months", percentage: 35 },
  { value: "9", label: "9 Months", percentage: 50 },
  { value: "12", label: "12 Months", percentage: 75 },
  { value: "18", label: "18 Months", percentage: 100 },
]

export default function StakingPage() {
  const { account, isConnected, connectWallet, signer } = useBlockchain()
  const { toast } = useToast()

  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedDuration, setSelectedDuration] = useState("1")
  const [aedLstBalance, setAedLstBalance] = useState("0.0")
  const [isLoading, setIsLoading] = useState(true)
  const [isStaking, setIsStaking] = useState(false)
  const [estimatedRewards, setEstimatedRewards] = useState("0.0")

  // Fetch assets
  useEffect(() => {
    async function fetchData() {
      if (!isConnected || !account || !signer) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // For demo purposes, we'll create some mock assets
        // In a real app, you'd fetch these from the blockchain
        const mockAssets: Asset[] = [
          {
            id: "1",
            type: "tbond",
            contractAddress: CONTRACT_ADDRESSES.tBonds,
            name: "T-Bond #1",
            value: "1,000",
            image: "/placeholder.svg?height=200&width=200&text=T-Bond+1",
            selected: false,
          },
          {
            id: "2",
            type: "tbond",
            contractAddress: CONTRACT_ADDRESSES.tBonds,
            name: "T-Bond #2",
            value: "1,000",
            image: "/placeholder.svg?height=200&width=200&text=T-Bond+2",
            selected: false,
          },
          {
            id: "3",
            type: "tbond",
            contractAddress: CONTRACT_ADDRESSES.tBonds,
            name: "T-Bond #3",
            value: "1,000",
            image: "/placeholder.svg?height=200&width=200&text=T-Bond+3",
            selected: false,
          },
          {
            id: "1001",
            type: "property",
            contractAddress: CONTRACT_ADDRESSES.propertyDeeds,
            name: "Property Deed #1001",
            value: "100,000",
            image: "/placeholder.svg?height=200&width=200&text=Property+1001",
            selected: false,
          },
          {
            id: "1002",
            type: "property",
            contractAddress: CONTRACT_ADDRESSES.propertyDeeds,
            name: "Property Deed #1002",
            value: "100,000",
            image: "/placeholder.svg?height=200&width=200&text=Property+1002",
            selected: false,
          },
        ]

        setAssets(mockAssets)

        // Simulate AED LST balance
        setAedLstBalance("125.75")

        // Calculate initial estimated rewards
        updateEstimatedRewards(mockAssets, selectedDuration)
      } catch (error) {
        console.error("Error fetching staking data:", error)
        toast({
          title: "Error",
          description: "Failed to load staking data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [account, isConnected, signer, toast, selectedDuration])

  const updateEstimatedRewards = (assetsList: Asset[], duration: string) => {
    const selectedAssets = assetsList.filter((asset) => asset.selected)
    if (selectedAssets.length === 0) {
      setEstimatedRewards("0.0")
      return
    }

    // Find the percentage for the selected duration
    const durationOption = durationOptions.find((option) => option.value === duration)
    const percentage = durationOption ? durationOption.percentage / 100 : 0.1 // Default to 10% if not found

    // Calculate total value of selected assets
    const totalValue = selectedAssets.reduce((sum, asset) => {
      return sum + Number.parseFloat(asset.value.replace(/,/g, ""))
    }, 0)

    // Calculate estimated rewards
    const rewards = totalValue * percentage
    setEstimatedRewards(rewards.toLocaleString())
  }

  const handleAssetToggle = (assetId: string) => {
    const updatedAssets = assets.map((asset) => {
      if (asset.id === assetId) {
        return { ...asset, selected: !asset.selected }
      }
      return asset
    })
    setAssets(updatedAssets)
    updateEstimatedRewards(updatedAssets, selectedDuration)
  }

  const handleDurationChange = (value: string) => {
    setSelectedDuration(value)
    updateEstimatedRewards(assets, value)
  }

  const handleStake = async () => {
    const selectedAssets = assets.filter((asset) => asset.selected)
    if (selectedAssets.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one asset to stake.",
        variant: "destructive",
      })
      return
    }

    if (!signer) {
      toast({
        title: "Error",
        description: "Please connect your wallet.",
        variant: "destructive",
      })
      return
    }

    setIsStaking(true)
    try {
      // Create contract instance
      const stakingVaultContract = new ethers.Contract(CONTRACT_ADDRESSES.nftStakingVault, NftStakingVaultABI, signer)

      // Process each selected asset
      for (const asset of selectedAssets) {
        // First, check if the NFT is approved for the staking vault
        const nftContract = new ethers.Contract(
          asset.contractAddress,
          [
            "function isApprovedForAll(address owner, address operator) view returns (bool)",
            "function setApprovalForAll(address operator, bool approved) external",
          ],
          signer,
        )

        const isApproved = await nftContract.isApprovedForAll(account, CONTRACT_ADDRESSES.nftStakingVault)

        if (!isApproved) {
          // Approve the staking vault to transfer the NFT
          const approveTx = await nftContract.setApprovalForAll(CONTRACT_ADDRESSES.nftStakingVault, true)
          toast({
            title: "Approving...",
            description: "Please confirm the approval transaction in your wallet.",
          })
          await approveTx.wait()
        }

        // Determine collection ID
        const collectionId = asset.type === "tbond" ? 0 : 1

        // Determine lock period index based on duration
        const lockPeriodIndex = durationOptions.findIndex((option) => option.value === selectedDuration)

        // Stake the NFT
        const tx = await stakingVaultContract.stakeNFT(
          collectionId,
          asset.id,
          1, // amount
          lockPeriodIndex,
        )

        toast({
          title: "Staking...",
          description: `Staking ${asset.name}. Please confirm the transaction in your wallet.`,
        })

        await tx.wait()
      }

      toast({
        title: "Success!",
        description: `Successfully staked ${selectedAssets.length} asset(s)`,
      })

      // Reset selections
      const resetAssets = assets.map((asset) => ({ ...asset, selected: false }))
      setAssets(resetAssets)
      updateEstimatedRewards(resetAssets, selectedDuration)
    } catch (error) {
      console.error("Error staking assets:", error)
      toast({
        title: "Error",
        description: "Failed to stake assets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl">
              Connect your wallet to access the staking dashboard.
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
          <h1 className="text-3xl font-bold">Staking</h1>
          <p className="text-muted-foreground">Stake your NFTs to earn AED LST tokens</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link href="/dapp">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {account?.substring(0, 6)}...{account?.substring(38)}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 mb-8 inline-block">
        <div className="flex items-center">
          <div>
            <p className="text-sm text-muted-foreground">AED LST Balance</p>
            <p className="text-xl font-bold">{aedLstBalance} AED</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Assets to Stake</CardTitle>
              <CardDescription>Choose the assets you want to stake</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <p>Loading your assets...</p>
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No assets available for staking</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">T-Bonds ($1,000 per token)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assets
                        .filter((asset) => asset.type === "tbond")
                        .map((asset) => (
                          <div
                            key={asset.id}
                            className={`border rounded-lg p-4 flex items-center gap-4 ${
                              asset.selected ? "border-primary bg-primary/5" : "border-border"
                            }`}
                          >
                            <Checkbox
                              id={`asset-${asset.id}`}
                              checked={asset.selected}
                              onCheckedChange={() => handleAssetToggle(asset.id)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`asset-${asset.id}`} className="font-medium cursor-pointer">
                                {asset.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">Value: ${asset.value}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Property Deeds ($100,000 per token)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {assets
                        .filter((asset) => asset.type === "property")
                        .map((asset) => (
                          <div
                            key={asset.id}
                            className={`border rounded-lg p-4 flex items-center gap-4 ${
                              asset.selected ? "border-primary bg-primary/5" : "border-border"
                            }`}
                          >
                            <Checkbox
                              id={`asset-${asset.id}`}
                              checked={asset.selected}
                              onCheckedChange={() => handleAssetToggle(asset.id)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={`asset-${asset.id}`} className="font-medium cursor-pointer">
                                {asset.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">Value: ${asset.value}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Staking Details</CardTitle>
              <CardDescription>Configure your staking parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Staking Duration</Label>
                  <Select value={selectedDuration} onValueChange={handleDurationChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} ({option.percentage}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium">Staking Summary</h3>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selected Assets</span>
                    <span className="font-medium">{assets.filter((a) => a.selected).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-medium">
                      $
                      {assets
                        .filter((a) => a.selected)
                        .reduce((sum, asset) => sum + Number.parseFloat(asset.value.replace(/,/g, "")), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {durationOptions.find((option) => option.value === selectedDuration)?.label || "1 Month"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward Percentage</span>
                    <span className="font-medium text-primary">
                      {durationOptions.find((option) => option.value === selectedDuration)?.percentage || 10}%
                    </span>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-medium">
                      <span>You Will Receive</span>
                      <span className="text-primary">{estimatedRewards} AED LST</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Staking Terms</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Your asset will be locked for the selected duration</li>
                    <li>Early unstaking will incur a 10% penalty on rewards</li>
                    <li>Rewards are distributed daily to your wallet</li>
                    <li>Staking does not affect your ownership of the asset</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={assets.filter((a) => a.selected).length === 0 || isStaking}
                onClick={handleStake}
              >
                {isStaking ? "Staking..." : "Stake Selected Assets"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

