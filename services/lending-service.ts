import { ethers } from "ethers"
import { IERC20__factory } from "@/types/ethers-contracts"

export interface Loan {
  id: string
  borrower: string
  assetAddress: string
  tokenId: string
  loanAmount: string // formatted amount
  repayAmount: string // formatted amount
  durationInMonths: number
  ltv: number
  startDate: Date
  endDate: Date
  active: boolean
  isOverdue: boolean
  remainingDays: number
  assetType: "tbond" | "property"
  assetMetadata?: {
    name: string
    description: string
    image: string
  }
  serviceFee: string
  totalRepayment: string
}

export interface LoanParameters {
  durationOptions: number[]
  releasePercentages: number[]
  serviceFeeRate: number
}

export class LendingService {
  private lendingVaultContract: ethers.Contract
  private signer: ethers.Signer

  constructor(lendingVaultContract: ethers.Contract, signer: ethers.Signer) {
    this.lendingVaultContract = lendingVaultContract
    this.signer = signer
  }

  async getUsdcTokenAddress(): Promise<string> {
    return await this.lendingVaultContract.usdcToken()
  }

  async getValidDurations(): Promise<number[]> {
    const durations = await this.lendingVaultContract.getValidDurations()
    return durations.map((d: any) => Number(d))
  }

  async getTotalActiveLoans(): Promise<number> {
    const totalActiveLoans = await this.lendingVaultContract.totalActiveLoans()
    return Number(totalActiveLoans)
  }

  async getTotalValueLocked(): Promise<string> {
    const tvl = await this.lendingVaultContract.totalValueLocked()
    return ethers.formatUnits(tvl, 6) // USDC has 6 decimals
  }

  async getContractUsdcBalance(): Promise<string> {
    const balance = await this.lendingVaultContract.getContractUSDCBalance()
    return ethers.formatUnits(balance, 6) // USDC has 6 decimals
  }

  async getNftValue(assetAddress: string, tokenId: string): Promise<string> {
    const value = await this.lendingVaultContract.getNFTValue(assetAddress, tokenId)
    return ethers.formatUnits(value, 6) // USDC has 6 decimals
  }

  async getUserLoans(address: string): Promise<Loan[]> {
    try {
      const loanIds = await this.lendingVaultContract.getActiveLoansByBorrower(address)

      const loans: Loan[] = []

      for (const loanId of loanIds) {
        const loanData = await this.lendingVaultContract.getLoan(loanId)

        const startDate = new Date(Number(loanData.startDate) * 1000)
        const endDate = new Date(Number(loanData.endDate) * 1000)
        const now = new Date()
        const isOverdue = loanData.active && now > endDate

        // Calculate remaining days
        const remainingMs = Math.max(0, endDate.getTime() - now.getTime())
        const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24))

        loans.push({
          id: loanId.toString(),
          borrower: loanData.borrower,
          assetAddress: loanData.assetAddress,
          tokenId: loanData.tokenId.toString(),
          loanAmount: ethers.formatUnits(loanData.loanAmount, 6), // USDC has 6 decimals
          repayAmount: ethers.formatUnits(loanData.repayAmount, 6), // USDC has 6 decimals
          durationInMonths: Number(loanData.durationInMonths),
          ltv: Number(loanData.ltv),
          startDate,
          endDate,
          active: loanData.active,
          isOverdue,
          remainingDays,
          assetType: "tbond", // Placeholder, needs to be determined dynamically
          serviceFee: "0", // Placeholder
          totalRepayment: "0", // Placeholder
        })
      }

      return loans
    } catch (error) {
      console.error("Error fetching user loans:", error)
      return []
    }
  }

  async createLoan(
    assetAddress: string,
    tokenId: string,
    ltvPercentage: number,
    durationInMonths: number,
  ): Promise<boolean> {
    try {
      // First, check if the NFT is approved for the lending vault
      const erc1155Interface = new ethers.Interface([
        "function isApprovedForAll(address owner, address operator) view returns (bool)",
      ])

      const nftContract = new ethers.Contract(assetAddress, erc1155Interface, this.signer)
      const signerAddress = await this.signer.getAddress()
      const isApproved = await nftContract.isApprovedForAll(signerAddress, this.lendingVaultContract.target)

      if (!isApproved) {
        // Approve the lending vault to transfer the NFT
        const tx = await nftContract.setApprovalForAll(this.lendingVaultContract.target, true)
        await tx.wait()
      }

      // Create the loan
      const tx = await this.lendingVaultContract.createLoan(assetAddress, tokenId, ltvPercentage, durationInMonths)

      await tx.wait()
      return true
    } catch (error) {
      console.error("Error creating loan:", error)
      return false
    }
  }

  async repayLoan(loanId: string): Promise<boolean> {
    try {
      // First, get the loan to know how much USDC to approve
      const loanData = await this.lendingVaultContract.getLoan(loanId)
      const repayAmount = loanData.repayAmount

      // Get the USDC token address
      const usdcAddress = await this.lendingVaultContract.usdcToken()

      // Create USDC contract instance
      const usdcContract = IERC20__factory.connect(usdcAddress, this.signer)

      // Approve the lending vault to spend USDC
      const approveTx = await usdcContract.approve(this.lendingVaultContract.target, repayAmount)
      await approveTx.wait()

      // Repay the loan
      const tx = await this.lendingVaultContract.repayLoan(loanId)
      await tx.wait()

      return true
    } catch (error) {
      console.error("Error repaying loan:", error)
      return false
    }
  }

  // Calculate maximum loan amount based on NFT value and LTV
  async calculateMaxLoanAmount(assetAddress: string, tokenId: string, ltvPercentage: number): Promise<string> {
    const nftValue = await this.getNftValue(assetAddress, tokenId)
    const maxLoanAmount = Number.parseFloat(nftValue) * (ltvPercentage / 100)
    return maxLoanAmount.toFixed(6)
  }

  // Calculate repayment amount based on loan amount, duration, and interest rate (1% per month)
  calculateRepayAmount(loanAmount: string, durationInMonths: number): string {
    const amount = Number.parseFloat(loanAmount)
    const interestRate = 0.01 * durationInMonths // 1% per month
    const repayAmount = amount + amount * interestRate
    return repayAmount.toFixed(6)
  }

  async getLoanParameters(): Promise<LoanParameters> {
    // Dummy implementation, replace with actual contract calls
    return {
      durationOptions: [3, 6, 9, 12],
      releasePercentages: [25, 50, 75],
      serviceFeeRate: 1,
    }
  }

  async getAvailableLiquidity(): Promise<string> {
    // Dummy implementation, replace with actual contract calls
    return "1000000"
  }

  async borrowAgainstAsset(
    tokenId: string,
    amount: string,
    durationMonths: number,
  ): Promise<{ success: boolean; error?: string }> {
    // Dummy implementation, replace with actual contract calls
    return { success: true }
  }

  async depositToLendingPool(amount: string): Promise<{ success: boolean; error?: string }> {
    // Dummy implementation, replace with actual contract calls
    return { success: true }
  }

  async getMaxLoanAmount(tokenId: string): Promise<string> {
    // Dummy implementation, replace with actual contract calls
    return "5000"
  }

  async calculateServiceFee(loanAmount: string, durationMonths: number): Promise<string> {
    // Dummy implementation, replace with actual contract calls
    return (Number.parseFloat(loanAmount) * 0.01 * durationMonths).toFixed(2)
  }
}

