import { ethers } from "ethers"

export interface StakedNFT {
  id: string
  collectionId: number
  tokenId: string
  amount: number
  value: string // formatted value
  lockPeriodIndex: number
  lockPeriodDays: number
  lockEndTime: Date
  released: boolean
  isExpired: boolean
  remainingDays: number
  releasePercentage: number
}

export interface NFTCollection {
  id: number
  contractAddress: string
  defaultValue: string // formatted value
  active: boolean
}

export class StakingVaultService {
  private stakingVaultContract: ethers.Contract
  private signer: ethers.Signer

  // Lock periods in days (from contract)
  private lockPeriods: number[] = [30, 90, 180, 270, 365, 540]
  private releasePercentages: number[] = [10, 20, 35, 50, 75, 100]

  constructor(stakingVaultContract: ethers.Contract, signer: ethers.Signer) {
    this.stakingVaultContract = stakingVaultContract
    this.signer = signer
  }

  async getCollectionCount(): Promise<number> {
    try {
      const count = await this.stakingVaultContract.collectionCount()
      return Number(count)
    } catch (error) {
      console.error("Error getting collection count:", error)
      return 0
    }
  }

  async getCollection(collectionId: number): Promise<NFTCollection | null> {
    try {
      const collection = await this.stakingVaultContract.nftCollections(collectionId)

      return {
        id: collectionId,
        contractAddress: collection.contractAddress,
        defaultValue: ethers.formatEther(collection.defaultValue),
        active: collection.active,
      }
    } catch (error) {
      console.error(`Error getting collection ${collectionId}:`, error)
      return null
    }
  }

  async getAllCollections(): Promise<NFTCollection[]> {
    try {
      const count = await this.getCollectionCount()
      const collections: NFTCollection[] = []

      for (let i = 0; i < count; i++) {
        const collection = await this.getCollection(i)
        if (collection) {
          collections.push(collection)
        }
      }

      return collections
    } catch (error) {
      console.error("Error getting all collections:", error)
      return []
    }
  }

  async getTokenValue(collectionId: number, tokenId: string): Promise<string> {
    try {
      const value = await this.stakingVaultContract.getTokenValue(collectionId, tokenId)
      return ethers.formatEther(value)
    } catch (error) {
      console.error(`Error getting token value for collection ${collectionId}, token ${tokenId}:`, error)
      return "0"
    }
  }

  async getUserStakedNFTs(address: string): Promise<StakedNFT[]> {
    try {
      const stakingIds = await this.stakingVaultContract.getUserStakedNFTs(address)
      const stakedNFTs: StakedNFT[] = []

      for (const stakingId of stakingIds) {
        const details = await this.stakingVaultContract.getStakedNFTDetails(stakingId)

        const lockEndTime = new Date(Number(details.lockEndTime) * 1000)
        const now = new Date()
        const isExpired = details.lockEndTime < Math.floor(now.getTime() / 1000)

        // Calculate remaining days
        const remainingMs = Math.max(0, lockEndTime.getTime() - now.getTime())
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24))

        stakedNFTs.push({
          id: stakingId.toString(),
          collectionId: Number(details.collectionId),
          tokenId: details.tokenId.toString(),
          amount: Number(details.amount),
          value: ethers.formatEther(details.value),
          lockPeriodIndex: Number(details.lockPeriodIndex),
          lockPeriodDays: this.lockPeriods[Number(details.lockPeriodIndex)] / (24 * 60 * 60), // Convert seconds to days
          lockEndTime,
          released: details.released,
          isExpired,
          remainingDays,
          releasePercentage: this.releasePercentages[Number(details.lockPeriodIndex)],
        })
      }

      return stakedNFTs
    } catch (error) {
      console.error(`Error getting staked NFTs for ${address}:`, error)
      return []
    }
  }

  async stakeNFT(collectionId: number, tokenId: string, amount: number, lockPeriodIndex: number): Promise<boolean> {
    try {
      // First, check if the NFT is approved for the staking vault
      const collection = await this.getCollection(collectionId)
      if (!collection) {
        throw new Error(`Collection ${collectionId} not found`)
      }

      const erc1155Interface = new ethers.Interface([
        "function isApprovedForAll(address owner, address operator) view returns (bool)",
        "function setApprovalForAll(address operator, bool approved) external",
      ])

      const nftContract = new ethers.Contract(collection.contractAddress, erc1155Interface, this.signer)
      const signerAddress = await this.signer.getAddress()
      const isApproved = await nftContract.isApprovedForAll(signerAddress, this.stakingVaultContract.target)

      if (!isApproved) {
        // Approve the staking vault to transfer the NFT
        const tx = await nftContract.setApprovalForAll(this.stakingVaultContract.target, true)
        await tx.wait()
      }

      // Stake the NFT
      const tx = await this.stakingVaultContract.stakeNFT(collectionId, tokenId, amount, lockPeriodIndex)

      await tx.wait()
      return true
    } catch (error) {
      console.error("Error staking NFT:", error)
      return false
    }
  }

  async unstakeNFT(stakingId: string): Promise<boolean> {
    try {
      const tx = await this.stakingVaultContract.unstakeNFT(stakingId)
      await tx.wait()
      return true
    } catch (error) {
      console.error(`Error unstaking NFT ${stakingId}:`, error)
      return false
    }
  }

  getLockPeriods(): { days: number; releasePercentage: number }[] {
    return this.lockPeriods.map((period, index) => ({
      days: period / (24 * 60 * 60), // Convert seconds to days
      releasePercentage: this.releasePercentages[index],
    }))
  }

  async getStakingCount(): Promise<number> {
    try {
      const count = await this.stakingVaultContract.stakingCount()
      return Number(count)
    } catch (error) {
      console.error("Error getting staking count:", error)
      return 0
    }
  }

  async getAedLstAddress(): Promise<string> {
    try {
      return await this.stakingVaultContract.aedStablecoin()
    } catch (error) {
      console.error("Error getting AED LST address:", error)
      return ethers.ZeroAddress
    }
  }
}

