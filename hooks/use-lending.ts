"use client"

import { useState, useEffect, useCallback } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { LendingService, type Loan } from "@/services/lending-service"
import { useToast } from "@/hooks/use-toast"

export function useLending() {
  const { lendingVault, signer, account, isConnected } = useBlockchain()
  const [lendingService, setLendingService] = useState<LendingService | null>(null)
  const [loans, setLoans] = useState<Loan[]>([])
  const [validDurations, setValidDurations] = useState<number[]>([])
  const [totalActiveLoans, setTotalActiveLoans] = useState(0)
  const [totalValueLocked, setTotalValueLocked] = useState("0")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Initialize lending service
  useEffect(() => {
    if (lendingVault && signer) {
      const service = new LendingService(lendingVault, signer)
      setLendingService(service)
    } else {
      setLendingService(null)
    }
  }, [lendingVault, signer])

  // Fetch valid durations and stats
  useEffect(() => {
    async function fetchData() {
      if (!lendingService) return

      try {
        const [durations, activeLoans, tvl] = await Promise.all([
          lendingService.getValidDurations(),
          lendingService.getTotalActiveLoans(),
          lendingService.getTotalValueLocked(),
        ])

        setValidDurations(durations)
        setTotalActiveLoans(activeLoans)
        setTotalValueLocked(tvl)
      } catch (error) {
        console.error("Error fetching lending data:", error)
      }
    }

    fetchData()
  }, [lendingService])

  // Fetch user loans
  const fetchUserLoans = useCallback(async () => {
    if (!lendingService || !account || !isConnected) {
      setLoans([])
      return
    }

    setIsLoading(true)

    try {
      const userLoans = await lendingService.getUserLoans(account)
      setLoans(userLoans)
    } catch (error) {
      console.error("Error fetching user loans:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your loans. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [lendingService, account, isConnected, toast])

  // Fetch user loans on mount and when dependencies change
  useEffect(() => {
    fetchUserLoans()
  }, [fetchUserLoans])

  // Create a loan
  const createLoan = useCallback(
    async (assetAddress: string, tokenId: string, ltvPercentage: number, durationInMonths: number) => {
      if (!lendingService) {
        toast({
          title: "Error",
          description: "Lending service not initialized.",
          variant: "destructive",
        })
        return false
      }

      setIsLoading(true)

      try {
        const success = await lendingService.createLoan(assetAddress, tokenId, ltvPercentage, durationInMonths)

        if (success) {
          toast({
            title: "Success",
            description: "Loan created successfully!",
          })

          // Refresh user loans
          await fetchUserLoans()
          return true
        } else {
          toast({
            title: "Error",
            description: "Failed to create loan. Please try again.",
            variant: "destructive",
          })
          return false
        }
      } catch (error) {
        console.error("Error creating loan:", error)
        toast({
          title: "Error",
          description: "Failed to create loan. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [lendingService, toast, fetchUserLoans],
  )

  // Repay a loan
  const repayLoan = useCallback(
    async (loanId: string) => {
      if (!lendingService) {
        toast({
          title: "Error",
          description: "Lending service not initialized.",
          variant: "destructive",
        })
        return false
      }

      setIsLoading(true)

      try {
        const success = await lendingService.repayLoan(loanId)

        if (success) {
          toast({
            title: "Success",
            description: "Loan repaid successfully!",
          })

          // Refresh user loans
          await fetchUserLoans()
          return true
        } else {
          toast({
            title: "Error",
            description: "Failed to repay loan. Please try again.",
            variant: "destructive",
          })
          return false
        }
      } catch (error) {
        console.error("Error repaying loan:", error)
        toast({
          title: "Error",
          description: "Failed to repay loan. Please try again.",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [lendingService, toast, fetchUserLoans],
  )

  // Calculate maximum loan amount
  const calculateMaxLoanAmount = useCallback(
    async (assetAddress: string, tokenId: string, ltvPercentage: number) => {
      if (!lendingService) return "0"

      try {
        return await lendingService.calculateMaxLoanAmount(assetAddress, tokenId, ltvPercentage)
      } catch (error) {
        console.error("Error calculating max loan amount:", error)
        return "0"
      }
    },
    [lendingService],
  )

  // Calculate repayment amount
  const calculateRepayAmount = useCallback(
    (loanAmount: string, durationInMonths: number) => {
      if (!lendingService) return "0"

      try {
        return lendingService.calculateRepayAmount(loanAmount, durationInMonths)
      } catch (error) {
        console.error("Error calculating repay amount:", error)
        return "0"
      }
    },
    [lendingService],
  )

  return {
    loans,
    validDurations,
    totalActiveLoans,
    totalValueLocked,
    isLoading,
    createLoan,
    repayLoan,
    calculateMaxLoanAmount,
    calculateRepayAmount,
    refreshLoans: fetchUserLoans,
  }
}

