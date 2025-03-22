"use client"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { useLending } from "@/hooks/use-lending"
import { useAssets } from "@/hooks/use-assets"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Asset } from "@/services/asset-service"

export function CreateLoanForm() {
  const { isConnected } = useBlockchain()
  const { assets, isLoading: isLoadingAssets } = useAssets()
  const {
    validDurations,
    createLoan,
    calculateMaxLoanAmount,
    calculateRepayAmount,
    isLoading: isCreatingLoan,
  } = useLending()

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [ltvPercentage, setLtvPercentage] = useState(50) // Default to 50%
  const [durationInMonths, setDurationInMonths] = useState(3) // Default to 3 months
  const [maxLoanAmount, setMaxLoanAmount] = useState("0")
  const [loanAmount, setLoanAmount] = useState("0")
  const [repayAmount, setRepayAmount] = useState("0")

  // Filter out assets that are already being used as collateral
  const availableAssets = assets.filter((asset) => !asset.isLocked)

  // Update max loan amount when selected asset or LTV changes
  useEffect(() => {
    async function updateMaxLoanAmount() {
      if (!selectedAsset) {
        setMaxLoanAmount("0")
        setLoanAmount("0")
        return
      }

      const max = await calculateMaxLoanAmount(selectedAsset.contractAddress, selectedAsset.id, ltvPercentage)

      setMaxLoanAmount(max)
      setLoanAmount(max) // Set loan amount to max by default
    }

    updateMaxLoanAmount()
  }, [selectedAsset, ltvPercentage, calculateMaxLoanAmount])

  // Update repay amount when loan amount or duration changes
  useEffect(() => {
    const repay = calculateRepayAmount(loanAmount, durationInMonths)
    setRepayAmount(repay)
  }, [loanAmount, durationInMonths, calculateRepayAmount])

  // Handle asset selection
  const handleAssetSelect = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId)
    setSelectedAsset(asset || null)
  }

  // Handle loan creation
  const handleCreateLoan = async () => {
    if (!selectedAsset) return

    await createLoan(selectedAsset.contractAddress, selectedAsset.id, ltvPercentage, durationInMonths)
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Loan</CardTitle>
          <CardDescription>Connect your wallet to create a loan</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isLoadingAssets) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Loan</CardTitle>
          <CardDescription>Loading your assets...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (availableAssets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Loan</CardTitle>
          <CardDescription>You don't have any available assets to use as collateral</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Loan</CardTitle>
        <CardDescription>Borrow USDC against your NFT assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="asset">Select Asset</Label>
          <Select onValueChange={handleAssetSelect}>
            <SelectTrigger id="asset">
              <SelectValue placeholder="Select an asset" />
            </SelectTrigger>
            <SelectContent>
              {availableAssets.map((asset) => (
                <SelectItem key={asset.id} value={asset.id}>
                  {asset.type === "tbond" ? "T-Bond" : "Property Deed"} #{asset.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAsset && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="ltv">Loan-to-Value (LTV): {ltvPercentage}%</Label>
                <span className="text-sm text-muted-foreground">Max 70%</span>
              </div>
              <Slider
                id="ltv"
                min={10}
                max={70}
                step={5}
                value={[ltvPercentage]}
                onValueChange={(values) => setLtvPercentage(values[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Loan Duration</Label>
              <Select
                value={durationInMonths.toString()}
                onValueChange={(value) => setDurationInMonths(Number.parseInt(value))}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {validDurations.map((duration) => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} {duration === 1 ? "month" : "months"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount (USDC)</Label>
              <Input
                id="loan-amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                max={maxLoanAmount}
              />
              <p className="text-sm text-muted-foreground">Max: {Number.parseFloat(maxLoanAmount).toFixed(2)} USDC</p>
            </div>

            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Interest Rate:</span>
                  <span className="text-sm font-medium">
                    {durationInMonths}% ({durationInMonths} months × 1%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Repayment Amount:</span>
                  <span className="text-sm font-medium">{Number.parseFloat(repayAmount).toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Loan Term:</span>
                  <span className="text-sm font-medium">{durationInMonths} months</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleCreateLoan}
          disabled={!selectedAsset || isCreatingLoan || Number.parseFloat(loanAmount) <= 0}
          className="w-full"
        >
          {isCreatingLoan ? "Creating Loan..." : "Create Loan"}
        </Button>
      </CardFooter>
    </Card>
  )
}

