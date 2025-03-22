"use client"

import type { Loan } from "@/services/lending-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Calendar } from "lucide-react"

interface LoanCardProps {
  loan: Loan
  onRepay: (loanId: string) => Promise<void>
}

export function LoanCard({ loan, onRepay }: LoanCardProps) {
  const now = new Date()
  const isExpired = loan.endTime < now
  const daysLeft = Math.ceil((loan.endTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const handleRepay = () => {
    onRepay(loan.id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Loan #{loan.id}</CardTitle>
            <CardDescription>
              {loan.assetType === "tbond" ? "T-Bond" : "Property Deed"} #{loan.tokenId}
            </CardDescription>
          </div>
          <Badge variant={loan.active ? (isExpired ? "destructive" : "default") : "outline"}>
            {!loan.active ? "Repaid" : isExpired ? "Expired" : "Active"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loan.assetMetadata?.image && (
          <img
            src={loan.assetMetadata.image || "/placeholder.svg"}
            alt={loan.assetMetadata.name || `Asset #${loan.tokenId}`}
            className="w-full h-32 object-cover rounded-md mb-4"
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-primary mr-2 shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Loan Amount</p>
              <p className="font-medium">{Number.parseFloat(loan.amount).toLocaleString()} AED</p>
            </div>
          </div>

          <div className="flex items-start">
            <DollarSign className="h-5 w-5 text-primary mr-2 shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Service Fee</p>
              <p className="font-medium">{Number.parseFloat(loan.serviceFee).toLocaleString()} AED</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-primary mr-2 shrink-0" />
            <div>
              <p className="text-sm text-gray-400">Start Date</p>
              <p className="font-medium">{loan.startTime.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-primary mr-2 shrink-0" />
            <div>
              <p className="text-sm text-gray-400">End Date</p>
              <p className="font-medium">{loan.endTime.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {loan.active && (
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm">{isExpired ? "Loan period has ended" : `${daysLeft} days remaining`}</span>
              </div>
              <Badge variant={isExpired ? "destructive" : "secondary"}>
                {isExpired ? "Overdue" : `${Math.round((daysLeft / (loan.duration / (60 * 60 * 24))) * 100)}%`}
              </Badge>
            </div>
          </div>
        )}

        <div className="p-3 border border-gray-700 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Total Repayment</span>
            <span className="font-medium text-primary">
              {Number.parseFloat(loan.totalRepayment).toLocaleString()} AED
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!loan.active} onClick={handleRepay}>
          {loan.active ? "Repay Loan" : "Loan Repaid"}
        </Button>
      </CardFooter>
    </Card>
  )
}

