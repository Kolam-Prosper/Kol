"use client"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { useServices } from "@/hooks/use-services"
import type { Asset } from "@/services/asset-service"
import type { Loan, LoanParameters } from "@/services/lending-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BorrowForm } from "@/components/lending/borrow-form"
import { LoanCard } from "@/components/lending/loan-card"
import { LendForm } from "@/components/lending/lend-form"
import { useToast } from "@/hooks/use-toast"

export default function LendingPage() {
  const { account, isConnected, connectWallet } = useBlockchain()
  const { assetService, lendingService } = useServices()
  const { toast } = useToast()

  const [assets, setAssets] = useState<Asset[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [loanParameters, setLoanParameters] = useState<LoanParameters | null>(null)
  const [availableLiquidity, setAvailableLiquidity] = useState<string>("0")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("borrow")

  useEffect(() => {
    async function fetchData() {
      if (!isConnected || !account || !assetService || !lendingService) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const [userAssets, userLoans, params, liquidity] = await Promise.all([
          assetService.getAllUserAssets(account),
          lendingService.getUserLoans(account),
          lendingService.getLoanParameters(),
          lendingService.getAvailableLiquidity(),
        ])

        setAssets(userAssets)
        setLoans(userLoans)
        setLoanParameters(params)
        setAvailableLiquidity(liquidity)
      } catch (error) {
        console.error("Error fetching lending data:", error)
        toast({
          title: "Error",
          description: "Failed to load lending data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [account, isConnected, assetService, lendingService, toast])

  const handleBorrow = async (tokenId: string, amount: string, durationMonths: number) => {
    if (!lendingService) return

    try {
      const result = await lendingService.borrowAgainstAsset(tokenId, amount, durationMonths)

      if (result.success) {
        toast({
          title: "Success",
          description: "Loan created successfully!",
        })

        // Refresh loans
        const userLoans = await lendingService.getUserLoans(account!)
        setLoans(userLoans)

        // Switch to the "My Loans" tab
        setActiveTab("loans")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create loan.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating loan:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRepay = async (loanId: string) => {
    if (!lendingService) return

    try {
      const result = await lendingService.repayLoan(loanId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Loan repaid successfully!",
        })

        // Refresh loans
        const userLoans = await lendingService.getUserLoans(account!)
        setLoans(userLoans)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to repay loan.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error repaying loan:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLend = async (amount: string) => {
    if (!lendingService) return

    try {
      const result = await lendingService.depositToLendingPool(amount)

      if (result.success) {
        toast({
          title: "Success",
          description: "Deposit successful!",
        })

        // Refresh available liquidity
        const liquidity = await lendingService.getAvailableLiquidity()
        setAvailableLiquidity(liquidity)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to deposit to lending pool.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error depositing to lending pool:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>Connect your wallet to access the Kolam Prosper lending platform</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={connectWallet} className="w-full">
                Connect Wallet
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <p>Loading lending data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Lending & Borrowing</h1>
      <p className="text-gray-500 mb-8">Borrow against your tokenized assets or lend to earn interest</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Available Assets</CardTitle>
            <CardDescription>Your tokenized assets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assets.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
            <CardDescription>Your current loans</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loans.filter((loan) => loan.active).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Liquidity</CardTitle>
            <CardDescription>Total funds available for borrowing</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Number.parseFloat(availableLiquidity).toLocaleString()} AED</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="borrow">Borrow</TabsTrigger>
          <TabsTrigger value="lend">Lend</TabsTrigger>
          <TabsTrigger value="loans">My Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="borrow">
          {assets.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Assets Found</CardTitle>
                <CardDescription>You need tokenized assets to borrow against</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Tokenize Asset</Button>
              </CardFooter>
            </Card>
          ) : (
            <BorrowForm
              assets={assets}
              loanParameters={loanParameters}
              onBorrow={handleBorrow}
              lendingService={lendingService}
            />
          )}
        </TabsContent>

        <TabsContent value="lend">
          <LendForm availableLiquidity={availableLiquidity} onLend={handleLend} />
        </TabsContent>

        <TabsContent value="loans">
          {loans.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Loans Found</CardTitle>
                <CardDescription>You don't have any active loans</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setActiveTab("borrow")}>Get a Loan</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} onRepay={handleRepay} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

