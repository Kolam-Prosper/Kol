"use client"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { useStaking } from "@/hooks/use-staking"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Asset } from "@/services/asset-service"

export function StakeNFTForm() {
  const { isConnected } = useBlockchain()
  const { stakableAssets, collections, stakeNFT, getLockPeriods, isLoading } = useStaking()

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<number | null>(null)
  const [lockPeriodIndex, setLockPeriodIndex] = useState<number>(0)
  const [amount, setAmount] = useState(1)
  const [estimatedValue, setEstimatedValue] = useState("0")
  const [estimatedAed, setEstimatedAed] = useState("0")

  const lockPeriods = getLockPeriods()

  // Update estimated value and AED when inputs change
  useEffect(() => {
    if (!selectedAsset || selectedCollection === null) {
      setEstimatedValue("0")
      setEstimatedAed("0")
      return
    }

    // In a real implementation, you would fetch the token value from the contract
    // For now, we'll use a placeholder value
    const tokenValue = "1000" // 1000 AED per token

    setEstimatedValue(tokenValue)

    // Calculate estimated AED based on release percentage
    if (lockPeriodIndex !== null && lockPeriodIndex >= 0 && lockPeriodIndex < lockPeriods.length) {
      const releasePercentage = lockPeriods[lockPeriodIndex].releasePercentage
      const aedAmount = (Number.parseFloat(tokenValue) * releasePercentage) / 100
      setEstimatedAed(aedAmount.toString())
    }
  }, [selectedAsset, selectedCollection, lockPeriodIndex, lockPeriods])

  // Handle asset selection
  const handleAssetSelect = (assetId: string) => {
    const asset = stakableAssets.find((a) => a.id === assetId)
    setSelectedAsset(asset || null)

    // Try to find a matching collection
    if (asset) {
      const collection = collections.find(
        (c) => c.contractAddress.toLowerCase() === asset.contractAddress.toLowerCase(),
      )
      if (collection) {
        setSelectedCollection(collection.id)
      } else {
        setSelectedCollection(null)
      }
    }
  }

  // Handle staking
  const handleStake = async () => {
    if (!selectedAsset || selectedCollection === null) return

    await stakeNFT(selectedCollection, selectedAsset.id, amount, lockPeriodIndex)
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stake NFT</CardTitle>
          <CardDescription>Connect your wallet to stake NFTs</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (stakableAssets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stake NFT</CardTitle>
          <CardDescription>You don't have any NFTs available for staking</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stake NFT</CardTitle>
        <CardDescription>Stake your NFTs to receive AED tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="asset">Select Asset</Label>
          <Select onValueChange={handleAssetSelect}>
            <SelectTrigger id="asset">
              <SelectValue placeholder="Select an asset" />
            </SelectTrigger>
            <SelectContent>
              {stakableAssets.map((asset) => (
                <SelectItem key={asset.id} value={asset.id}>
                  {asset.type === "tbond" ? "T-Bond" : "Property Deed"} #{asset.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAsset && selectedCollection !== null && (
          <>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Number.parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lock-period">Lock Period</Label>
              <Select
                value={lockPeriodIndex.toString()}
                onValueChange={(value) => setLockPeriodIndex(Number.parseInt(value))}
              >
                <SelectTrigger id="lock-period">
                  <SelectValue placeholder="Select lock period" />
                </SelectTrigger>
                <SelectContent>
                  {lockPeriods.map((period, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {period.days} days - {period.releasePercentage}% release
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Estimated Value:</span>
                  <span className="text-sm font-medium">{Number.parseFloat(estimatedValue).toFixed(2)} AED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Release Percentage:</span>
                  <span className="text-sm font-medium">{lockPeriods[lockPeriodIndex].releasePercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Estimated AED Tokens:</span>
                  <span className="text-sm font-medium">{Number.parseFloat(estimatedAed).toFixed(2)} AED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Lock Period:</span>
                  <span className="text-sm font-medium">{lockPeriods[lockPeriodIndex].days} days</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleStake}
          disabled={!selectedAsset || selectedCollection === null || isLoading}
          className="w-full"
        >
          {isLoading ? "Staking..." : "Stake NFT"}
        </Button>
      </CardFooter>
    </Card>
  )
}

