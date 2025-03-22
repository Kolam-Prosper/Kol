import type { ethers } from "ethers"

export interface Asset {
  id: string
  type: "tbond" | "property"
  contractAddress: string
  owner: string
  tokenURI: string
  isLocked?: boolean
  amount: number
  metadata?: {
    name: string
    description: string
    image: string
    attributes?: Array<{
      trait_type: string
      value: string
    }>
    price?: string
    location?: string
    size?: string
    yearBuilt?: string
  }
}

export class AssetService {
  private tBondsContract: ethers.Contract
  private propertyDeedsContract: ethers.Contract

  constructor(tBondsContract: ethers.Contract, propertyDeedsContract: ethers.Contract) {
    this.tBondsContract = tBondsContract
    this.propertyDeedsContract = propertyDeedsContract
  }

  async getUserTBonds(address: string): Promise<Asset[]> {
    try {
      // For T-Bonds, we can use the tokensOfOwner function
      const tokenIds = await this.tBondsContract.tokensOfOwner(address)
      const assets: Asset[] = []

      for (const tokenId of tokenIds) {
        const balance = await this.tBondsContract.balanceOf(address, tokenId)

        if (balance > 0) {
          const tokenURI = await this.tBondsContract.uri(tokenId)

          const asset: Asset = {
            id: tokenId.toString(),
            type: "tbond",
            contractAddress: this.tBondsContract.target,
            owner: address,
            tokenURI,
            amount: Number(balance),
            isLocked: false, // Default to not locked
          }

          // Parse metadata from tokenURI if it's a data URI
          if (tokenURI && tokenURI.startsWith("data:application/json;base64,")) {
            try {
              const base64Data = tokenURI.replace("data:application/json;base64,", "")
              const jsonString = atob(base64Data)
              const metadata = JSON.parse(jsonString)
              asset.metadata = metadata
            } catch (error) {
              console.error("Error parsing T-Bond metadata:", error)
            }
          }

          assets.push(asset)
        }
      }

      return assets
    } catch (error) {
      console.error("Error fetching T-Bonds:", error)
      return []
    }
  }

  async getUserPropertyDeeds(address: string): Promise<Asset[]> {
    try {
      const assets: Asset[] = []

      // Property deeds start from STARTING_INDEX (1000) and go up to MAX_SUPPLY (100)
      const startingIndex = await this.propertyDeedsContract.STARTING_INDEX()
      const maxSupply = await this.propertyDeedsContract.MAX_SUPPLY()

      // Check each potential token ID
      for (let i = 0; i < maxSupply; i++) {
        const tokenId = startingIndex.add(i + 1) // Add 1 because tokenIds start from 1001

        try {
          const balance = await this.propertyDeedsContract.balanceOf(address, tokenId)

          if (balance > 0) {
            const tokenURI = await this.propertyDeedsContract.uri(tokenId)

            const asset: Asset = {
              id: tokenId.toString(),
              type: "property",
              contractAddress: this.propertyDeedsContract.target,
              owner: address,
              tokenURI,
              amount: Number(balance),
              isLocked: false, // Default to not locked
            }

            // Parse metadata from tokenURI if it's a data URI
            if (tokenURI && tokenURI.startsWith("data:application/json;base64,")) {
              try {
                const base64Data = tokenURI.replace("data:application/json;base64,", "")
                const jsonString = atob(base64Data)
                const metadata = JSON.parse(jsonString)
                asset.metadata = metadata
              } catch (error) {
                console.error("Error parsing Property Deed metadata:", error)
              }
            }

            assets.push(asset)
          }
        } catch (error) {
          // Skip if token doesn't exist
          continue
        }
      }

      return assets
    } catch (error) {
      console.error("Error fetching Property Deeds:", error)
      return []
    }
  }

  async getAllUserAssets(address: string): Promise<Asset[]> {
    const [tBonds, propertyDeeds] = await Promise.all([this.getUserTBonds(address), this.getUserPropertyDeeds(address)])

    return [...tBonds, ...propertyDeeds]
  }

  // Check if an asset is locked in the staking vault
  async checkIfAssetIsLocked(
    stakingVaultContract: ethers.Contract,
    assetAddress: string,
    tokenId: string,
    owner: string,
  ): Promise<boolean> {
    try {
      // Get all staked NFTs for the user
      const stakingIds = await stakingVaultContract.getUserStakedNFTs(owner)

      // Check each staking to see if it matches our asset
      for (const stakingId of stakingIds) {
        const details = await stakingVaultContract.getStakedNFTDetails(stakingId)

        // Get the collection address from the collection ID
        const collection = await stakingVaultContract.nftCollections(details.collectionId)

        // If this staking matches our asset and is not released, it's locked
        if (
          collection.contractAddress.toLowerCase() === assetAddress.toLowerCase() &&
          details.tokenId.toString() === tokenId &&
          !details.released
        ) {
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error checking if asset is locked:", error)
      return false
    }
  }

  // Update lock status for all assets
  async updateAssetLockStatus(
    assets: Asset[],
    stakingVaultContract: ethers.Contract,
    lendingVaultContract: ethers.Contract,
  ): Promise<Asset[]> {
    const updatedAssets = [...assets]

    for (let i = 0; i < updatedAssets.length; i++) {
      const asset = updatedAssets[i]

      // Check if locked in staking vault
      const isLockedInStaking = await this.checkIfAssetIsLocked(
        stakingVaultContract,
        asset.contractAddress,
        asset.id,
        asset.owner,
      )

      // TODO: Check if locked in lending vault
      // This would require a similar function to check the lending vault

      asset.isLocked = isLockedInStaking // || isLockedInLending
    }

    return updatedAssets
  }
}

