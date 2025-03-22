"use client"

import { useMemo } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { AssetService } from "@/services/asset-service"
import { StakingService } from "@/services/staking-service"
import { LendingService } from "@/services/lending-service"
import { ProjectService } from "@/services/project-service"

export function useServices() {
  const { tBonds, propertyDeeds, projectFactory, nftStakingVault, lendingVault, isConnected } = useBlockchain()

  const assetService = useMemo(() => {
    if (!isConnected || !tBonds || !propertyDeeds) return null
    return new AssetService(tBonds, propertyDeeds)
  }, [isConnected, tBonds, propertyDeeds])

  const stakingService = useMemo(() => {
    if (!isConnected || !nftStakingVault) return null
    return new StakingService(nftStakingVault)
  }, [isConnected, nftStakingVault])

  const lendingService = useMemo(() => {
    if (!isConnected || !lendingVault) return null
    return new LendingService(lendingVault)
  }, [isConnected, lendingVault])

  const projectService = useMemo(() => {
    if (!isConnected || !projectFactory) return null
    return new ProjectService(projectFactory)
  }, [isConnected, projectFactory])

  return {
    assetService,
    stakingService,
    lendingService,
    projectService,
  }
}

