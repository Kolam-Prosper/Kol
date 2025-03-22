"use client"

import { useState, useEffect, useCallback } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { AssetService, type Asset } from "@/services/asset-service"
import { useToast } from "@/hooks/use-toast"

export function useAssets() {
  const { tBonds, propertyDeeds, stakingVault, lendingVault, account, isConnected } = useBlockchain()
  const [assetService, setAssetService] = useState<AssetService | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initialize asset service
  useEffect(() => {
    if (tBonds && propertyDeeds) {
      const service = new AssetService(tBonds, propertyDeeds)
      setAssetService(service)
    } else {
      setAssetService(null)
    }
  }, [tBonds, propertyDeeds])

  // Fetch user assets
  const fetchUserAssets = useCallback(async () => {
    if (!assetService || !account || !isConnected) {
      setAssets([])
      return
    }

    setIsLoading(true)

    try {
      // Get all user assets
      const userAssets = await assetService.getAllUserAssets(account)

      // Update lock status if staking vault and lending vault are available
      let assetsWithLockStatus = userAssets
      if (stakingVault && lendingVault) {
        assetsWithLockStatus = await assetService.updateAssetLockStatus(userAssets, stakingVault, lendingVault)
      }

      setAssets(assetsWithLockStatus)
    } catch (error) {
      console.error("Error fetching user assets:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your assets. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [assetService, account, isConnected, stakingVault, lendingVault, toast])

  // Fetch user assets on mount and when dependencies change
  useEffect(() => {
    fetchUserAssets()
  }, [fetchUserAssets])

  return {
    assets,
    isLoading,
    refreshAssets: fetchUserAssets,
  }
}

