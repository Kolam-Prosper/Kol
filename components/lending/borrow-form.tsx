"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Asset } from "@/services/asset-service"
import type { LoanParameters, LendingService } from "@/services/lending-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BorrowFormProps {
  assets: Asset[]
  loanParameters: LoanParameters | null
  lendingService: LendingService | null
  onBorrow: (tokenId: string, amount: string, durationMonths: number) => Promise<void>
}

export function BorrowForm({ assets, loanParameters, lendingService, onBorrow }: BorrowFormProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [selectedAssetType, setSelectedAssetType] = useState<"tbond" | "property">("tbond")
  const [maxLoanAmount, setMaxLoanAmount] = useState<string>("0")
  const [loanAmount, setLoanAmount] = useState<string>("0")
  const [releasePercentage, setReleasePercentage] = useState<number>(0)
  const [durationMonths, setDurationMonths] = useState<number>(0)
  const [serviceFee, setServiceFee] = useState<string>("0")
  const [totalRepayment, setTotalRepayment] = useState<string>("0")
  const [isCalculating, setIsCalculating] = useState(false)

  // Filter assets by type
  const filteredAssets = assets.filter((asset) => asset.type === selectedAssetType)

  // Set default values when parameters change
  useEffect(() => {
    if (loanParameters) {
      setReleasePercentage(loanParameters.releasePercentages[0] || 10)
      setDurationMonths(loanParameters.durationOptions[0] || 1)
    }
  }, [loanParameters])

  // Update max loan amount when selected asset changes
  useEffect(() => {
    async function fetchMaxLoanAmount() {
      if (!selectedAsset || !lendingService) return

      try {
        const maxAmount = await lendingService.getMaxLoanAmount(selectedAsset.id)
        setMaxLoanAmount(maxAmount)

        // Set default loan amount to 50% of max
        const defaultAmount = ((Number.parseFloat(maxAmount) * releasePercentage) / 100).toFixed(2)
        setLoanAmount(defaultAmount)
      } catch (error) {
        console.error("Error fetching max loan amount:", error)
      }
    }

    fetchMaxLoanAmount()
  }, [selectedAsset, lendingService, releasePercentage])

  // Calculate service fee and total repayment when loan parameters change
  useEffect(() => {
    async function calculateFees() {
      if (!lendingService || Number.parseFloat(loanAmount) <= 0 || !durationMonths) return

      setIsCalculating(true)

      try {
        const fee = await lendingService.calculateServiceFee(loanAmount, durationMonths)
        setServiceFee(fee)

        const total = (Number.parseFloat(loanAmount) + Number.parseFloat(fee)).toFixed(4)
        setTotalRepayment(total)
      } catch (error) {
        console.error("Error calculating fees:", error)
      } finally {
        setIsCalculating(false)
      }
    }

    calculateFees()
  }, [loanAmount, durationMonths, lendingService])

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset)
  }

  const handleReleasePercentageChange = (value: number) => {
    setReleasePercentage(value)

    // Update loan amount based on new percentage
    if (maxLoanAmount) {
      const newAmount = ((Number.parseFloat(maxLoanAmount) * value) / 100).toFixed(2)
      setLoanAmount(newAmount)
    }
  }

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Validate input
    if (value === "" || isNaN(Number.parseFloat(value))) {
      setLoanAmount("0")
      return
    }

    const numValue = Number.parseFloat(value)
    const maxValue = Number.parseFloat(maxLoanAmount)

    // Ensure loan amount doesn't exceed max
    if (numValue > maxValue) {
      setLoanAmount(maxLoanAmount)
    } else {
      setLoanAmount(value)
    }

    // Update release percentage based on new amount
    if (maxValue > 0) {
      const newPercentage = Math.round((numValue / maxValue) * 100)
      setReleasePercentage(newPercentage)
    }
  }

  const handleBorrow = async () => {
    if (!selectedAsset || Number.parseFloat(loanAmount) <= 0 || !durationMonths) return

    await onBorrow(selectedAsset.id, loanAmount, durationMonths)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="tbond" onValueChange={(value) => setSelectedAssetType(value as "tbond" | "property")}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="tbond">T-Bonds</TabsTrigger>
          <TabsTrigger value="property">Property Deeds</TabsTrigger>
        </TabsList>

        <TabsContent value="tbond">
          {filteredAssets.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No T-Bonds Found</CardTitle>
                <CardDescription>You don't have any T-Bonds to borrow against</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className={`cursor-pointer transition-all ${
                    selectedAsset?.id === asset.id ? "border-primary ring-2 ring-primary/20" : "hover:border-gray-400"
                  }`}
                  onClick={() => handleAssetSelect(asset)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">T-Bond #{asset.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {asset.metadata ? (
                      <>
                        <p className="text-sm mb-2">{asset.metadata.name}</p>
                        {asset.metadata.image && (
                          <img
                            src={asset.metadata.image || "/placeholder.svg"}
                            alt={asset.metadata.name}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-32 bg-gray-800 rounded-md flex items-center justify-center">
                        <p className="text-gray-400">No image</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="property">
          {filteredAssets.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Property Deeds Found</CardTitle>
                <CardDescription>You don't have any Property Deeds to borrow against</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filteredAssets.map((asset) => (
                <Card
                  key={asset.id}
                  className={`cursor-pointer transition-all ${
                    selectedAsset?.id === asset.id ? "border-primary ring-2 ring-primary/20" : "hover:border-gray-400"
                  }`}
                  onClick={() => handleAssetSelect(asset)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Property Deed #{asset.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {asset.metadata ? (
                      <>
                        <p className="text-sm mb-2">{asset.metadata.name}</p>
                        {asset.metadata.image && (
                          <img
                            src={asset.metadata.image || "/placeholder.svg"}
                            alt={asset.metadata.name}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        )}
                      </>
                    ) : (
                      <div className="w-full h-32 bg-gray-800 rounded-md flex items-center justify-center">
                        <p className="text-gray-400">No image</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedAsset && (
        <Card>
          <CardHeader>
            <CardTitle>Loan Parameters</CardTitle>
            <CardDescription>
              Configure your loan against {selectedAssetType === "tbond" ? "T-Bond" : "Property Deed"} #
              {selectedAsset.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Release Percentage</Label>
                <span className="text-sm font-medium">{releasePercentage}%</span>
              </div>
              <div className="px-1">
                <Slider
                  value={[releasePercentage]}
                  min={loanParameters?.releasePercentages[0] || 10}
                  max={loanParameters?.releasePercentages[loanParameters.releasePercentages.length - 1] || 70}
                  step={1}
                  onValueChange={(value) => handleReleasePercentageChange(value[0])}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{loanParameters?.releasePercentages[0] || 10}%</span>
                <span>{loanParameters?.releasePercentages[loanParameters.releasePercentages.length - 1] || 70}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loan-amount">Loan Amount (AED)</Label>
              <Input
                id="loan-amount"
                type="number"
                value={loanAmount}
                onChange={handleLoanAmountChange}
                min="0"
                max={maxLoanAmount}
                step="0.01"
              />
              <div className="text-xs text-gray-500">Max: {Number.parseFloat(maxLoanAmount).toLocaleString()} AED</div>
            </div>

            <div className="space-y-2">
              <Label>Loan Duration</Label>
              <RadioGroup
                value={durationMonths.toString()}
                onValueChange={(value) => setDurationMonths(Number.parseInt(value))}
                className="grid grid-cols-3 gap-2"
              >
                {loanParameters?.durationOptions.map((months) => (
                  <div key={months} className="flex items-center space-x-2">
                    <RadioGroupItem value={months.toString()} id={`duration-${months}`} />
                    <Label htmlFor={`duration-${months}`} className="cursor-pointer">
                      {months} {months === 1 ? "month" : "months"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Loan Amount</span>
                <span className="font-medium">{Number.parseFloat(loanAmount).toLocaleString()} AED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">
                  Service Fee ({loanParameters?.serviceFeeRate || 1}% × {durationMonths} months)
                </span>
                <span className="font-medium">
                  {isCalculating ? "..." : Number.parseFloat(serviceFee).toLocaleString()} AED
                </span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total Repayment</span>
                  <span className="font-medium text-primary">
                    {isCalculating ? "..." : Number.parseFloat(totalRepayment).toLocaleString()} AED
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleBorrow}
              disabled={!selectedAsset || Number.parseFloat(loanAmount) <= 0 || !durationMonths || isCalculating}
            >
              Get Loan
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

