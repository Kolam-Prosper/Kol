"use client"

import { useState } from "react"
import type { Asset } from "@/services/asset-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Lock, Unlock } from "lucide-react"

interface AssetDetailsProps {
  asset: Asset
  onStake?: (asset: Asset) => void
  onCreateLoan?: (asset: Asset) => void
}

export function AssetDetails({ asset, onStake, onCreateLoan }: AssetDetailsProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Format asset name
  const assetName =
    asset.metadata?.name || (asset.type === "tbond" ? `T-Bond #${asset.id}` : `Property Deed #${asset.id}`)

  // Format asset description
  const assetDescription =
    asset.metadata?.description || (asset.type === "tbond" ? "UAE Treasury Bond" : "UAE Property Deed")

  // Get asset image
  const assetImage = asset.metadata?.image || "/placeholder.svg?height=400&width=600"

  // Format asset attributes
  const assetAttributes = asset.metadata?.attributes || []

  return (
    <Card className={asset.isLocked ? "border-amber-500" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{assetName}</CardTitle>
            <CardDescription>{asset.type === "tbond" ? "Treasury Bond" : "Property Deed"}</CardDescription>
          </div>
          {asset.isLocked ? (
            <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-500">
              <Lock className="h-3 w-3" />
              Locked
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Unlock className="h-3 w-3" />
              Available
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video relative rounded-md overflow-hidden mb-4">
          <img src={assetImage || "/placeholder.svg"} alt={assetName} className="w-full h-full object-cover" />
        </div>

        <div className="space-y-2">
          <p className="text-sm">{assetDescription}</p>

          {asset.metadata?.price && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Price:</span>
              <span className="font-medium">{asset.metadata.price}</span>
            </div>
          )}

          {asset.metadata?.location && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location:</span>
              <span className="font-medium">{asset.metadata.location}</span>
            </div>
          )}

          {asset.metadata?.size && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Size:</span>
              <span className="font-medium">{asset.metadata.size}</span>
            </div>
          )}

          {asset.metadata?.yearBuilt && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Year Built:</span>
              <span className="font-medium">{asset.metadata.yearBuilt}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Token ID:</span>
            <span className="font-medium">{asset.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-medium">{asset.amount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{assetName}</DialogTitle>
                <DialogDescription>{assetDescription}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={assetImage || "/placeholder.svg"}
                  alt={assetName}
                  className="w-full aspect-video object-cover rounded-md"
                />

                <div className="space-y-2">
                  {assetAttributes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Attributes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {assetAttributes.map((attr, index) => (
                          <div key={index} className="flex justify-between p-2 bg-muted rounded-md">
                            <span className="text-xs text-muted-foreground">{attr.trait_type}:</span>
                            <span className="text-xs font-medium">{attr.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Contract Details</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Contract:</span>
                        <span className="text-xs font-medium truncate max-w-[200px]">{asset.contractAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Token ID:</span>
                        <span className="text-xs font-medium">{asset.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Owner:</span>
                        <span className="text-xs font-medium truncate max-w-[200px]">{asset.owner}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {!asset.isLocked && onStake && (
            <Button onClick={() => onStake(asset)} variant="default" className="flex-1">
              Stake
            </Button>
          )}
        </div>

        {!asset.isLocked && onCreateLoan && (
          <Button onClick={() => onCreateLoan(asset)} variant="outline" className="w-full">
            Get Loan
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

