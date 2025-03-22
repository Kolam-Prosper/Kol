import { ethers } from "ethers"

export class AedLstService {
  private aedLstContract: ethers.Contract
  private signer: ethers.Signer

  constructor(aedLstContract: ethers.Contract, signer: ethers.Signer) {
    this.aedLstContract = aedLstContract
    this.signer = signer
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.aedLstContract.balanceOf(address)
      return ethers.formatEther(balance) // AED LST is an ERC20 with 18 decimals
    } catch (error) {
      console.error("Error getting AED LST balance:", error)
      return "0"
    }
  }

  async getPrice(): Promise<string> {
    try {
      const price = await this.aedLstContract.getPrice()
      return ethers.formatEther(price) // Price is stored with 18 decimals
    } catch (error) {
      console.error("Error getting AED LST price:", error)
      return "0"
    }
  }

  async getTotalSupply(): Promise<string> {
    try {
      const totalSupply = await this.aedLstContract.totalSupply()
      return ethers.formatEther(totalSupply)
    } catch (error) {
      console.error("Error getting AED LST total supply:", error)
      return "0"
    }
  }

  async getStakingVaultAddress(): Promise<string> {
    try {
      return await this.aedLstContract.stakingVault()
    } catch (error) {
      console.error("Error getting staking vault address:", error)
      return ethers.ZeroAddress
    }
  }

  async transfer(to: string, amount: string): Promise<boolean> {
    try {
      const tx = await this.aedLstContract.transfer(to, ethers.parseEther(amount))
      await tx.wait()
      return true
    } catch (error) {
      console.error("Error transferring AED LST:", error)
      return false
    }
  }

  async approve(spender: string, amount: string): Promise<boolean> {
    try {
      const tx = await this.aedLstContract.approve(spender, ethers.parseEther(amount))
      await tx.wait()
      return true
    } catch (error) {
      console.error("Error approving AED LST:", error)
      return false
    }
  }
}

