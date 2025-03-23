import { ethers } from "ethers"
import { CONTRACT_ADDRESSES } from "@/config/contracts"
import NftStakingVaultABI from "@/abis/NftStakingVault.json"

export interface StakingAsset {
  id: string
  type: "tbond" | "property"
  contractAddress: string
  name: string
  value: string
  image: string
}

export interface StakingPosition {
  id: string
  assetId: string
  assetType: string
  startDate: Date
  endDate: Date
  duration: number
  rewards: string
  status: "active" | "completed" | "cancelled"
}

export class StakingVaultService {
  private contract: ethers.Contract | null = null
  private signer: ethers.Signer | null = null

  constructor(signer?: ethers.Signer) {
    if (signer) {
      this.signer = signer
      this.contract = new ethers.Contract(CONTRACT_ADDRESSES.nftStakingVault, NftStakingVaultABI, signer)
    }
  }

  public setSigner(signer: ethers.Signer) {
    this.signer = signer
    this.contract = new ethers.Contract(CONTRACT_ADDRESSES.nftStakingVault, NftStakingVaultABI, signer)
  }

  public async getStakableAssets(account: string): Promise<StakingAsset[]> {
    // In a real implementation, this would fetch from the blockchain
    // For now, we'll return mock data
    return [
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
        id: "3",
        type: "tbond",
        contractAddress: CONTRACT_ADDRESSES.tBonds,
        name: "T-Bond #3",
        value: "1,000",
        image: "/placeholder.svg?height=200&width=200&text=T-Bond+3",
      },
      {
        id: "1001",
        type: "property",
        contractAddress: CONTRACT_ADDRESSES.propertyDeeds,
        name: "Property Deed #1001",
        value: "100,000",
        image: "/placeholder.svg?height=200&width=200&text=Property+1001",
      },
      {
        id: "1002",
        type: "property",
        contractAddress: CONTRACT_ADDRESSES.propertyDeeds,
        name: "Property Deed #1002",
        value: "100,000",
        image: "/placeholder.svg?height=200&width=200&text=Property+1002",
      },
    ]
  }

  public async getStakingPositions(account: string): Promise<StakingPosition[]> {
    if (!this.contract || !this.signer) {
      throw new Error("Contract or signer not initialized")
    }

    // In a real implementation, this would fetch from the blockchain
    // For now, we'll return mock data
    return [
      {
        id: "1",
        assetId: "1",
        assetType: "tbond",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        duration: 90,
        rewards: "100",
        status: "active",
      },
    ]
  }

  public async stakeAsset(assetId: string, assetType: "tbond" | "property", duration: number): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error("Contract or signer not initialized")
    }

    try {
      // Determine collection ID
      const collectionId = assetType === "tbond" ? 0 : 1

      // Determine lock period index based on duration
      const lockPeriodIndex = Math.floor(duration / 30) - 1

      // In a real implementation, this would call the contract
      // For now, we'll just return a mock transaction hash
      return "0x" + Math.random().toString(16).substring(2, 42)
    } catch (error) {
      console.error("Error staking asset:", error)
      throw error
    }
  }

  public async unstakeAsset(positionId: string): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error("Contract or signer not initialized")
    }

    try {
      // In a real implementation, this would call the contract
      // For now, we'll just return a mock transaction hash
      return "0x" + Math.random().toString(16).substring(2, 42)
    } catch (error) {
      console.error("Error unstaking asset:", error)
      throw error
    }
  }

  public async claimRewards(positionId: string): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error("Contract or signer not initialized")
    }

    try {
      // In a real implementation, this would call the contract
      // For now, we'll just return a mock transaction hash
      return "0x" + Math.random().toString(16).substring(2, 42)
    } catch (error) {
      console.error("Error claiming rewards:", error)
      throw error
    }
  }

  public calculateEstimatedRewards(assetValue: string, duration: number): string {
    // Simple calculation for estimated rewards
    // In a real implementation, this would use actual rates from the contract
    const value = Number.parseFloat(assetValue.replace(/,/g, ""))
    const months = Math.floor(duration / 30)

    let percentage
    if (months <= 1) {
      percentage = 0.1 // 10%
    } else if (months <= 3) {
      percentage = 0.2 // 20%
    } else if (months <= 6) {
      percentage = 0.35 // 35%
    } else if (months <= 9) {
      percentage = 0.5 // 50%
    } else if (months <= 12) {
      percentage = 0.75 // 75%
    } else {
      percentage = 1.0 // 100%
    }

    const rewards = value * percentage
    return rewards.toLocaleString()
  }
}

export default StakingVaultService


