"use client"

import { useLending } from "@/hooks/use-lending"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

export function LoansList() {
  const { loans, repayLoan, isLoading, refreshLoans } = useLending()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Loans</CardTitle>
          <CardDescription>Loading your loans...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (loans.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Loans</CardTitle>
          <CardDescription>You don't have any active loans</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Loans</h2>
        <Button variant="outline" size="sm" onClick={refreshLoans}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loans.map((loan) => (
          <Card key={loan.id} className={loan.isOverdue ? "border-destructive" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Loan #{loan.id}</CardTitle>
                  <CardDescription>
                    {loan.assetAddress.substring(0, 6)}...{loan.assetAddress.substring(38)} - Token #{loan.tokenId}
                  </CardDescription>
                </div>
                {loan.active &&
                  (loan.isOverdue ? (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Overdue
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Active
                    </Badge>
                  ))}
                {!loan.active && (
                  <Badge variant="success" className="flex items-center gap-1 bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3" />
                    Repaid
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Loan Amount:</span>
                  <span className="font-medium">{Number.parseFloat(loan.loanAmount).toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Repayment Amount:</span>
                  <span className="font-medium">{Number.parseFloat(loan.repayAmount).toFixed(2)} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">LTV:</span>
                  <span className="font-medium">{loan.ltv}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="font-medium">{loan.durationInMonths} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Start Date:</span>
                  <span className="font-medium">{loan.startDate.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">End Date:</span>
                  <span className="font-medium">{loan.endDate.toLocaleDateString()}</span>
                </div>
                {loan.active && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining:</span>
                    <span className={`font-medium ${loan.isOverdue ? "text-destructive" : ""}`}>
                      {loan.isOverdue ? "Overdue" : `${loan.remainingDays} days`}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            {loan.active && (
              <CardFooter>
                <Button
                  onClick={() => repayLoan(loan.id)}
                  className="w-full"
                  variant={loan.isOverdue ? "destructive" : "default"}
                >
                  Repay Loan
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

