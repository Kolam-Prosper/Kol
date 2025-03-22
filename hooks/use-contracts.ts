"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useWallet } from "./use-wallet"
import { CONTRACT_ADDRESSES } from "@/config/contracts"

// Import ABIs
import TBondsABI from "@/abis/TBonds.json"
import PropertyDeedsABI from "@/abis/PropertyDeeds.json"
import ProjectFactoryABI from "@/abis/ProjectFactory.json"
import AedLstABI from "@/abis/AedLst.json"
import NftStakingVaultABI from "@/abis/NftStakingVault.json"
import LendingVaultABI from "@/abis/LendingVault.json"

export function useContracts() {
  const { provider, signer, isConnected } = useWallet()

  const [tBonds, setTBonds] = useState<ethers.Contract | null>(null)
  const [propertyDeeds, setPropertyDeeds] = useState<ethers.Contract | null>(null)
  const [projectFactory, setProjectFactory] = useState<ethers.Contract | null>(null)
  const [aedLst, setAedLst] = useState<ethers.Contract | null>(null)
  const [nftStakingVault, setNftStakingVault] = useState<ethers.Contract | null>(null)
  const [lendingVault, setLendingVault] = useState<ethers.Contract | null>(null)

  useEffect(() => {
    if (!isConnected || !provider || !signer) {
      setTBonds(null)
      setPropertyDeeds(null)
      setProjectFactory(null)
      setAedLst(null)
      setNftStakingVault(null)
      setLendingVault(null)
      return
    }

    // Initialize contracts with signer for write operations
    const tBondsContract = new ethers.Contract(CONTRACT_ADDRESSES.tBonds, TBondsABI, signer)

    const propertyDeedsContract = new ethers.Contract(CONTRACT_ADDRESSES.propertyDeeds, PropertyDeedsABI, signer)

    const projectFactoryContract = new ethers.Contract(CONTRACT_ADDRESSES.projectFactory, ProjectFactoryABI, signer)

    const aedLstContract = new ethers.Contract(CONTRACT_ADDRESSES.aedLst, AedLstABI, signer)

    const nftStakingVaultContract = new ethers.Contract(CONTRACT_ADDRESSES.nftStakingVault, NftStakingVaultABI, signer)

    const lendingVaultContract = new ethers.Contract(CONTRACT_ADDRESSES.lendingVault, LendingVaultABI, signer)

    setTBonds(tBondsContract)
    setPropertyDeeds(propertyDeedsContract)
    setProjectFactory(projectFactoryContract)
    setAedLst(aedLstContract)
    setNftStakingVault(nftStakingVaultContract)
    setLendingVault(lendingVaultContract)
  }, [isConnected, provider, signer])

  return {
    tBonds,
    propertyDeeds,
    projectFactory,
    aedLst,
    nftStakingVault,
    lendingVault,
  }
}

