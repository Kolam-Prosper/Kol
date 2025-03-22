"use client"

import { useStaking } from "@/hooks/use-staking"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Lock } from "lucide-react"

export function StakedNFTsList() {
  const { stakedNFTs, unstakeNFT, isLoading, refreshStakingData } = useStaking()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Staked NFTs</CardTitle>
          <CardDescription>Loading your staked NFTs...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (stakedNFTs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Staked NFTs</CardTitle>
          <CardDescription>You don't have any staked NFTs</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Staked NFTs</h2>
        <Button variant="outline" size="sm" onClick={refreshStakingData}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stakedNFTs.map((nft) => (
          <Card key={nft.id} className={nft.isExpired ? "border-amber-500" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Staking #{nft.id}</CardTitle>
                  <CardDescription>
                    Collection #{nft.collectionId} - Token #{nft.tokenId}
                  </CardDescription>
                </div>
                {!nft.released &&
                  (nft.isExpired ? (
                    <Badge variant="outline" className="flex items-center gap-1 border-amber-500 text-amber-500">
                      <CheckCircle className="h-3 w-3" />
                      Ready to Unstake
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Locked
                    </Badge>
                  ))}
                {nft.released && (
                  <Badge variant="success" className="flex items-center gap-1 bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3" />
                    Unstaked
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Value:</span>
                  <span className="font-medium">{Number.parseFloat(nft.value).toFixed(2)} AED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Release Percentage:</span>
                  <span className="font-medium">{nft.releasePercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">AED Released:</span>
                  <span className="font-medium">
                    {((Number.parseFloat(nft.value) * nft.releasePercentage) / 100).toFixed(2)} AED
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Lock Period:</span>
                  <span className="font-medium">{nft.lockPeriodDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">End Date:</span>
                  <span className="font-medium">{nft.lockEndTime.toLocaleDateString()}</span>
                </div>
                {!nft.released && !nft.isExpired && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining:</span>
                    <span className="font-medium">{nft.remainingDays} days</span>
                  </div>
                )}
              </div>
            </CardContent>
            {!nft.released && nft.isExpired && (
              <CardFooter>
                <Button onClick={() => unstakeNFT(nft.id)} className="w-full">
                  Unstake NFT
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

