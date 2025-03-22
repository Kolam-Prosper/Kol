"use client"

import { useState, useEffect, useCallback } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { StakingVaultService, type StakedNFT, type NFTCollection } from "@/services/staking-vault-service"
import { AedLstService } from "@/services/aed-lst-service"
import { useToast } from "@/hooks/use-toast"
import { useAssets } from "@/hooks/use-assets"

export function useStaking() {
  const { stakingVault, aedLst, signer, account, isConnected } = useBlockchain()
  const [stakingService, setStakingService] = useState<StakingVaultService | null>(null)
  const [aedLstService, setAedLstService] = useState<AedLstService | null>(null)
  const { assets, refreshAssets } = useAssets()

  const [stakedNFTs, setStakedNFTs] = useState<StakedNFT[]>([])
  const [collections, setCollections] = useState<NFTCollection[]>([])
  const [aedBalance, setAedBalance] = useState("0")
  const [aedPrice, setAedPrice] = useState("0")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initialize services
  useEffect(() => {
    if (stakingVault && aedLst && signer) {
      const stakingService = new StakingVaultService(stakingVault, signer)
      const aedLstService = new AedLstService(aedLst, signer)

      setStakingService(stakingService)
      setAedLstService(aedLstService)
    } else {
      setStakingService(null)
      setAedLstService(null)
    }
  }, [stakingVault, aedLst, signer])

  // Fetch collections
  useEffect(() => {
    async function fetchCollections() {
      if (!stakingService) return

      try {
        const allCollections = await stakingService.getAllCollections()
        setCollections(allCollections)
      } catch (error) {
        console.error("Error fetching collections:", error)
      }
    }

    fetchCollections()
  }, [stakingService])

  // Fetch user's staked NFTs and AED balance
  const fetchUserData = useCallback(async () => {
    if (!stakingService || !aedLstService || !account || !isConnected) {
      setStakedNFTs([])
      setAedBalance("0")
      return
    }

    setIsLoading(true)

    try {
      const [userStakedNFTs, balance, price] = await Promise.all([
        stakingService.getUserStakedNFTs(account),
        aedLstService.getBalance(account),
        aedLstService.getPrice(),
      ])

      setStakedNFTs(userStakedNFTs)
      setAedBalance(balance)
      setAedPrice(price)
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your staking data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [stakingService, aedLstService, account, isConnected, toast])

  // Fetch user data on mount and when dependencies change
  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  // Stake NFT
  const stakeNFT = useCallback(
    async (collectionId: number, tokenId: string, amount: number, lockPeriodIndex: number) => {
      if (!stakingService) {
        toast({
          title: "Error",
          description: "Staking service not initialized.",
          variant: "destructive",
        })
        return false
      }

      setIsLoading(true)

      try {
        const success = await stakingService.stakeNFT(collectionId, tokenId, amount, lockPeriodIndex)

        if (success) {
          toast({
            title: "Success",
            description: "NFT staked successfully!",
          })

          // Refresh user data and assets
          await fetchUserData()
          await refreshAssets()
          return true
        } else {
          toast({
            title: "Error",
            description: "Failed to stake NFT. Please try again.",
            variant: "destructive",
          })
          return false
        }
      } catch (error) {
        console.error("Error staking NFT:", error)
        toast({
          title: "Error",
          description: "Failed to stake NFT. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [stakingService, toast, fetchUserData, refreshAssets],
  )

  // Unstake NFT
  const unstakeNFT = useCallback(
    async (stakingId: string) => {
      if (!stakingService) {
        toast({
          title: "Error",
          description: "Staking service not initialized.",
          variant: "destructive",
        })
        return false
      }

      setIsLoading(true)

      try {
        const success = await stakingService.unstakeNFT(stakingId)

        if (success) {
          toast({
            title: "Success",
            description: "NFT unstaked successfully!",
          })

          // Refresh user data and assets
          await fetchUserData()
          await refreshAssets()
          return true
        } else {
          toast({
            title: "Error",
            description: "Failed to unstake NFT. Please try again.",
            variant: "destructive",
          })
          return false
        }
      } catch (error) {
        console.error("Error unstaking NFT:", error)
        toast({
          title: "Error",
          description: "Failed to unstake NFT. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [stakingService, toast, fetchUserData, refreshAssets],
  )

  // Transfer AED tokens
  const transferAed = useCallback(
    async (to: string, amount: string) => {
      if (!aedLstService) {
        toast({
          title: "Error",
          description: "AED LST service not initialized.",
          variant: "destructive",
        })
        return false
      }

      setIsLoading(true)

      try {
        const success = await aedLstService.transfer(to, amount)

        if (success) {
          toast({
            title: "Success",
            description: `${amount} AED transferred successfully!`,
          })

          // Refresh user data
          await fetchUserData()
          return true
        } else {
          toast({
            title: "Error",
            description: "Failed to transfer AED. Please try again.",
            variant: "destructive",
          })
          return false
        }
      } catch (error) {
        console.error("Error transferring AED:", error)
        toast({
          title: "Error",
          description: "Failed to transfer AED. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [aedLstService, toast, fetchUserData],
  )

  // Get lock periods
  const getLockPeriods = useCallback(() => {
    if (!stakingService) return []
    return stakingService.getLockPeriods()
  }, [stakingService])

  return {
    stakedNFTs,
    collections,
    aedBalance,
    aedPrice,
    isLoading,
    stakeNFT,
    unstakeNFT,
    transferAed,
    refreshStakingData: fetchUserData,
    getLockPeriods,
    stakableAssets: assets.filter((asset) => !asset.isLocked),
  }
}

