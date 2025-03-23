"use client"

import type React from "react"

import { useState } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, DollarSign, Percent, Building, Landmark, Loader2, Wallet } from "lucide-react"
import { MockUsdcFaucet } from "@/components/mock-usdc-faucet"
import { useToast } from "@/hooks/use-toast"
import { CONTRACT_ADDRESSES } from "@/config/contracts"
import { ethers } from "ethers"

// Import ABIs
import TBondsABI from "@/abis/TBonds.json"
import PropertyDeedsABI from "@/abis/PropertyDeeds.json"

// Mock USDC contract address on Unichain Sepolia
const MOCK_USDC_ADDRESS = "0x9e190a3FFfA34E513DD65741D2DaEa1CBf5Ca39C" // Replace with actual Mock USDC address

// Define product types
interface ProductFeature {
  icon: React.ElementType
  title: string
  description: string
}

interface Product {
  id: string
  type: "tbond" | "property"
  name: string
  description: string
  price: string
  currency: string
  contractAddress: string
  tokenId: number
  abi: any
  features: ProductFeature[]
  image: string
}

export default function MarketplacePage() {
  const { account, isConnected, connectWallet, signer } = useBlockchain()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState("1")
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { toast } = useToast()

  // T-Bond features
  const tBondFeatures: ProductFeature[] = [
    {
      icon: Calendar,
      title: "3-Year Payouts",
      description: "Bonds run for 3 years with annual payout of interest to the holder at 3.5%",
    },
    {
      icon: Percent,
      title: "Fixed Returns",
      description: "Guaranteed fixed returns with no loss of principal value",
    },
    {
      icon: DollarSign,
      title: "Equity Release",
      description:
        "Release equity through non-liquidating loans while maintaining ownership, stake and further increase your yield",
    },
  ]

  // Property Deed features
  const propertyDeedFeatures: ProductFeature[] = [
    {
      icon: Building,
      title: "Real Estate Backed",
      description: "Each token is backed by actual property deeds",
    },
    {
      icon: Percent,
      title: "Fixed Returns",
      description: "Potential for 30% returns within 18 months from construction developments",
    },
    {
      icon: DollarSign,
      title: "Equity Release",
      description: "Access up to 70% of the value as a non-liquidating loan, or stake for further rewards",
    },
  ]

  // Product data
  const products: Product[] = [
    {
      id: "tbond-001",
      type: "tbond",
      name: "UAE Treasury Bond Token",
      description:
        "Government treasury bonds transformed into digital tokens, can be sold on the open market, unique release equity strategies available through non-liquidating loans or staking for higher rewards.",
      price: "1000",
      currency: "USD",
      contractAddress: CONTRACT_ADDRESSES.tBonds,
      tokenId: 1, // The token ID to mint
      abi: TBondsABI,
      features: tBondFeatures,
      image: "/placeholder.svg?height=400&width=600&text=T-Bond",
    },
    {
      id: "property-001",
      type: "property",
      name: "Property Deed Token",
      description:
        "Digitized real estate deeds, purchase at construction cost on early developments with 30% returns within 18 months, release equity strategies available through non-liquidating loans or staking for higher rewards.",
      price: "100000",
      currency: "USD",
      contractAddress: CONTRACT_ADDRESSES.propertyDeeds,
      tokenId: 1001, // The token ID to mint
      abi: PropertyDeedsABI,
      features: propertyDeedFeatures,
      image: "/placeholder.svg?height=400&width=600&text=Property+Deed",
    },
  ]

  // Function to purchase tokens from the blockchain
  const purchaseToken = async (product: Product, amount: number) => {
    if (!signer || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive",
      })
      return
    }

    try {
      setIsPurchasing(true)
      console.log("Starting purchase process for", product.name, "amount:", amount)

      // Create contract instances
      const tokenContract = new ethers.Contract(product.contractAddress, product.abi, signer)
      console.log("Contract created for address:", product.contractAddress)

      // Directly call the mint function based on the contract type
      let tx

      if (product.type === "tbond") {
        console.log("Calling TBonds mint function")
        // TBonds mint function only takes the recipient address
        tx = await tokenContract.mint(account)
        console.log("TBonds mint transaction sent")
      } else {
        console.log("Calling PropertyDeeds safeMint function")
        // PropertyDeeds safeMint function takes recipient address and amount
        tx = await tokenContract.safeMint(account, amount)
        console.log("PropertyDeeds safeMint transaction sent")
      }

      console.log("Transaction hash:", tx.hash)
      toast({
        title: "Transaction submitted",
        description: "Please wait for confirmation...",
      })

      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt)

      toast({
        title: "Purchase successful!",
        description: `You have purchased ${amount} ${product.name}`,
      })

      // Close dialog if open
      setSelectedProduct(null)
      setPurchaseAmount("1")
    } catch (error: any) {
      console.error("Purchase error:", error)
      toast({
        title: "Purchase failed",
        description: error.message || "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleSinglePurchase = (product: Product) => {
    console.log("Single purchase button clicked for", product.name)
    purchaseToken(product, 1)
  }

  const handleMultiplePurchase = () => {
    if (!selectedProduct) return
    console.log("Multiple purchase button clicked")

    const amount = Number.parseInt(purchaseAmount)
    if (isNaN(amount) || amount < 1) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    purchaseToken(selectedProduct, amount)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl">
              Connect your wallet to browse and purchase tokenized assets.
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
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">Browse and purchase tokenized assets</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <MockUsdcFaucet />
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {account?.substring(0, 6)}...{account?.substring(38)}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPurchase={() => setSelectedProduct(product)}
            onDirectPurchase={() => handleSinglePurchase(product)}
            isPurchasing={isPurchasing}
          />
        ))}
      </div>

      {/* Purchase Dialog */}
      {selectedProduct && (
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Purchase {selectedProduct.name}</DialogTitle>
              <DialogDescription>Enter the amount of tokens you wish to purchase.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Total Cost</Label>
                <div className="text-2xl font-bold">
                  ${(Number(purchaseAmount || "0") * Number(selectedProduct.price)).toLocaleString()}{" "}
                  {selectedProduct.currency}
                </div>
              </div>
            </div>
            <DialogFooter className="flex space-x-2 sm:justify-end">
              <Button variant="outline" onClick={() => setSelectedProduct(null)} disabled={isPurchasing}>
                Cancel
              </Button>
              <Button onClick={handleMultiplePurchase} disabled={isPurchasing}>
                {isPurchasing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Purchase"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Product Card Component
function ProductCard({
  product,
  onPurchase,
  onDirectPurchase,
  isPurchasing,
}: {
  product: Product
  onPurchase: () => void
  onDirectPurchase: () => void
  isPurchasing: boolean
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=200&width=400')]"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <Badge className="w-fit mb-2" variant={product.type === "tbond" ? "default" : "secondary"}>
            {product.type === "tbond" ? (
              <>
                <Landmark className="mr-1 h-3 w-3" /> T-Bond
              </>
            ) : (
              <>
                <Building className="mr-1 h-3 w-3" /> Property Deed
              </>
            )}
          </Badge>
          <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
        </div>
      </div>
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4">{product.description}</p>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-baseline gap-2">
            <p className="text-sm text-muted-foreground">Price per token:</p>
            <p className="text-2xl font-bold">${Number(product.price).toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onDirectPurchase} variant="default" disabled={isPurchasing}>
              {isPurchasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Purchase"
              )}
            </Button>
            <Button onClick={onPurchase} variant="outline" disabled={isPurchasing}>
              Buy Multiple
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h4 className="font-semibold">Key Features</h4>
          <div className="grid grid-cols-1 gap-4">
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-medium">{feature.title}</h5>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

