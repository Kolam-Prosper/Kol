"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, Wallet, Info } from "lucide-react"
import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "@/config/contracts"
import LendingVaultABI from "@/abis/LendingVault.json"

// Define asset types
interface Asset {
  id: string
  type: "tbond" | "property"
  contractAddress: string
  name: string
  value: string
  image: string
}

export default function LendingPage() {
  const { account, isConnected, connectWallet, signer } = useBlockchain()
  const { toast } = useToast()

  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [loanPercentage, setLoanPercentage] = useState(20)
  const [loanDuration, setLoanDuration] = useState(3) // months
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)

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
          },
          {
            id: "2",
            type: "tbond",
            contractAddress: CONTRACT_ADDRESSES.tBonds,
            name: "T-Bond #2",
            value: "1,000",
            image: "/placeholder.svg?height=200&width=200&text=T-Bond+2",
          },
          {
            id: "1001",
            type: "property",
            contractAddress: CONTRACT_ADDRESSES.propertyDeeds,
            name: "Property Deed #1001",
            value: "100,000",
            image: "/placeholder.svg?height=200&width=200&text=Property+1001",
          },
        ]

        setAssets(mockAssets)

        // Set default selected asset
        if (mockAssets.length > 0) {
          setSelectedAsset(mockAssets[0])
        }
      } catch (error) {
        console.error("Error fetching lending data:", error)
        toast({
          title: "Error",
          description: "Failed to load lending data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [account, isConnected, signer, toast])

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const assetId = e.target.value
    const asset = assets.find((a) => a.id === assetId)
    if (asset) {
      setSelectedAsset(asset)
    }
  }

  const calculateLoanAmount = () => {
    if (!selectedAsset) return "0"
    const assetValue = Number.parseFloat(selectedAsset.value.replace(/,/g, ""))
    return ((assetValue * loanPercentage) / 100).toFixed(0)
  }

  const calculateServiceFee = () => {
    const loanAmount = Number.parseFloat(calculateLoanAmount())
    return (loanAmount * 0.01 * loanDuration).toFixed(0)
  }

  const calculateAedEquivalent = () => {
    const loanAmount = Number.parseFloat(calculateLoanAmount())
    // Simple conversion rate for demo purposes
    return Math.floor(loanAmount * 3.67)
  }

  const handleApplyForLoan = async () => {
    if (!selectedAsset || !signer) {
      toast({
        title: "Error",
        description: "Please select an asset and connect your wallet.",
        variant: "destructive",
      })
      return
    }

    setIsApplying(true)
    try {
      // Create contract instance
      const lendingVaultContract = new ethers.Contract(CONTRACT_ADDRESSES.lendingVault, LendingVaultABI, signer)

      // First, check if the NFT is approved for the lending vault
      const nftContract = new ethers.Contract(
        selectedAsset.contractAddress,
        [
          "function isApprovedForAll(address owner, address operator) view returns (bool)",
          "function setApprovalForAll(address operator, bool approved) external",
        ],
        signer,
      )

      const isApproved = await nftContract.isApprovedForAll(account, CONTRACT_ADDRESSES.lendingVault)

      if (!isApproved) {
        // Approve the lending vault to transfer the NFT
        const approveTx = await nftContract.setApprovalForAll(CONTRACT_ADDRESSES.lendingVault, true)
        toast({
          title: "Approving...",
          description: "Please confirm the approval transaction in your wallet.",
        })
        await approveTx.wait()
      }

      // Borrow against the asset
      const loanAmount = ethers.parseUnits(calculateLoanAmount(), "ether")
      const durationInSeconds = loanDuration * 30 * 24 * 60 * 60 // Approximate seconds in a month

      const tx = await lendingVaultContract.borrow(selectedAsset.id, loanAmount, durationInSeconds)

      toast({
        title: "Processing loan...",
        description: "Please confirm the transaction in your wallet.",
      })

      await tx.wait()

      toast({
        title: "Success!",
        description: `Your loan of ${calculateLoanAmount()} USD has been approved!`,
      })
    } catch (error) {
      console.error("Error applying for loan:", error)
      toast({
        title: "Error",
        description: "Failed to process your loan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsApplying(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl">
              Connect your wallet to access the lending dashboard.
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
          <h1 className="text-3xl font-bold">Lending</h1>
          <p className="text-muted-foreground">Release equity from your tokenized assets with non-liquidating loans.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Unlock the Value of Your Assets</CardTitle>
            <CardDescription>
              Our lending platform allows you to use your tokenized assets as collateral to access instant loans without
              the risk of liquidation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Fixed Service Fee</h3>
                <p className="text-sm text-muted-foreground">
                  Simple 1% per month service fee for loans, with no hidden charges
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Flexible Terms</h3>
                <p className="text-sm text-muted-foreground">Choose loan durations of 1 to 18 months</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Non-Liquidating Loans</h3>
                <p className="text-sm text-muted-foreground">
                  Release up to 70% of your asset value with no risk of liquidation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrow</CardTitle>
            <CardDescription>Use your tokenized assets as collateral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="asset-select">Select Asset</Label>
                <select
                  id="asset-select"
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                  value={selectedAsset?.id || ""}
                  onChange={handleAssetChange}
                >
                  <option value="" disabled>
                    Select an asset
                  </option>
                  {assets.filter((asset) => asset.type === "tbond").length > 0 && (
                    <optgroup label="T-Bond ($1,000 per token)">
                      {assets
                        .filter((asset) => asset.type === "tbond")
                        .map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {assets.filter((asset) => asset.type === "property").length > 0 && (
                    <optgroup label="Property Deed ($100,000 per token)">
                      {assets
                        .filter((asset) => asset.type === "property")
                        .map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="loan-percentage">Loan Percentage</Label>
                  <span className="text-sm font-medium">{loanPercentage}%</span>
                </div>
                <Slider
                  id="loan-percentage"
                  min={10}
                  max={70}
                  step={5}
                  value={[loanPercentage]}
                  onValueChange={(value) => setLoanPercentage(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10%</span>
                  <span>70%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="loan-duration">Loan Duration</Label>
                  <span className="text-sm font-medium">{loanDuration} months</span>
                </div>
                <Slider
                  id="loan-duration"
                  min={1}
                  max={18}
                  step={1}
                  value={[loanDuration]}
                  onValueChange={(value) => setLoanDuration(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 month</span>
                  <span>18 months</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Asset Value</span>
                  <span className="font-medium">${selectedAsset?.value || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loan Amount ({loanPercentage}%)</span>
                  <span className="font-medium">${calculateLoanAmount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee (1% × {loanDuration} months)</span>
                  <span className="font-medium">${calculateServiceFee()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-medium">AED LST Equivalent</span>
                  <span className="font-medium text-primary">{calculateAedEquivalent()} AED</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled={!selectedAsset || isApplying} onClick={handleApplyForLoan}>
              {isApplying ? "Processing..." : "Apply for Loan"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Learn More About Lending</CardTitle>
          <CardDescription>Understand how our non-liquidating loans work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">How It Works</h3>
            <p className="text-muted-foreground">
              Our lending platform allows you to use your tokenized assets as collateral to access instant loans. Unlike
              traditional DeFi lending platforms, our loans are non-liquidating, meaning you'll never lose your
              collateral due to market fluctuations.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Loan Terms</h3>
            <p className="text-muted-foreground">
              You can borrow up to 70% of your asset's value for a period of 1 to 18 months. The service fee is a simple
              1% per month, with no hidden charges. At the end of the loan term, you can either repay the loan to
              retrieve your asset or extend the loan for another term.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Eligible Assets</h3>
            <p className="text-muted-foreground">
              Currently, we support T-Bonds and Property Deeds as collateral. Each T-Bond is valued at $1,000, while
              Property Deeds are valued at $100,000. We're continuously expanding our supported asset types.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

