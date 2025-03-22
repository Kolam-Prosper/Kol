"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Percent, DollarSign, Clock, Landmark, Home } from "lucide-react"

export function Lending() {
  const [assetType, setAssetType] = useState("t-bond")
  const [tokenQuantity, setTokenQuantity] = useState(1)
  const [loanDuration, setLoanDuration] = useState("3")
  const [releasePercentage, setReleasePercentage] = useState("20")

  // Asset values
  const assetValues = {
    "t-bond": 1000, // $1,000 per T-bond
    property: 100000, // $100,000 per Property Deed
  }

  // Calculate total asset value
  const totalAssetValue = assetValues[assetType as keyof typeof assetValues] * tokenQuantity

  // Calculate loan amount based on release percentage
  const loanAmount = (totalAssetValue * Number.parseInt(releasePercentage)) / 100

  // Calculate service fee (1% per month)
  const serviceFee = loanAmount * 0.01 * Number.parseInt(loanDuration)

  // Calculate AED LST equivalent (3.67 AED = 1 USD)
  const aedEquivalent = loanAmount * 3.67

  // Duration options
  const durationOptions = ["1", "3", "6", "9", "12", "18"]

  // Release percentage options
  const percentageOptions = ["10", "20", "35", "50", "70"]

  return (
    <section id="lending" className="py-20 md:py-32 bg-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,87,34,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Lending & Borrowing
          </motion.h2>

          <motion.p
            className="text-lg text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Release equity from your tokenized assets with non-liquidating loans or stake to earn from the lending pool.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Unlock the Value of Your Assets</h3>
            <p className="text-gray-300 mb-8">
              Our lending platform allows you to use your tokenized assets as collateral to access instant loans without
              the risk of liquidation.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Fixed Service Fee</h4>
                  <p className="text-sm text-gray-400">
                    Simple 1% per month service fee for loans, with no hidden charges
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Flexible Terms</h4>
                  <p className="text-sm text-gray-400">
                    Choose loan durations of 1, 3, 6, 9, 12, or 18 months with customizable equity release options
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Non-Liquidating Loans</h4>
                  <p className="text-sm text-gray-400">
                    Release up to 70% of your asset value with no risk of liquidation
                  </p>
                </div>
              </div>
            </div>

            <div className="relative p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 mb-8">
              <div className="absolute -top-3 -right-3">
                <div className="p-1.5 rounded-full bg-primary text-white text-xs font-medium">New</div>
              </div>
              <h4 className="font-medium mb-2">Staking for Lenders</h4>
              <p className="text-sm text-gray-400 mb-4">
                Stake your tokens for 1-18 months to earn a percentage of fees from the lending pool, with rewards
                calculated monthly.
              </p>
              <div className="text-xs text-gray-500">
                <div className="flex justify-between mb-1">
                  <span>Pool Fee Split:</span>
                  <span className="text-gray-300">50/50 with Treasury</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated APY:</span>
                  <span className="text-gray-300">8-15% (varies with pool activity)</span>
                </div>
              </div>
            </div>

            <Button size="lg">
              Learn More About Lending <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800"
          >
            <Tabs defaultValue="borrow">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="borrow">Borrow</TabsTrigger>
                <TabsTrigger value="lend">Lend</TabsTrigger>
              </TabsList>

              <TabsContent value="borrow" className="space-y-6">
                <div className="space-y-4">
                  <Label>Select Asset Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        assetType === "t-bond"
                          ? "border-primary bg-primary/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => setAssetType("t-bond")}
                    >
                      <Landmark
                        className={`h-6 w-6 mb-2 ${assetType === "t-bond" ? "text-primary" : "text-gray-400"}`}
                      />
                      <div className="font-medium">T-Bond</div>
                      <div className="text-xs text-gray-400">$1,000 per token</div>
                    </div>
                    <div
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        assetType === "property"
                          ? "border-primary bg-primary/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                      onClick={() => setAssetType("property")}
                    >
                      <Home className={`h-6 w-6 mb-2 ${assetType === "property" ? "text-primary" : "text-gray-400"}`} />
                      <div className="font-medium">Property Deed</div>
                      <div className="text-xs text-gray-400">$100,000 per token</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token-quantity">Number of Tokens</Label>
                  <Input
                    id="token-quantity"
                    type="number"
                    min="1"
                    max={assetType === "property" ? "10" : "100"}
                    value={tokenQuantity}
                    onChange={(e) => setTokenQuantity(Number.parseInt(e.target.value) || 1)}
                  />
                  <div className="text-xs text-gray-500">
                    {assetType === "property" ? "Max 10 tokens" : "Max 100 tokens"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Loan Duration (Months)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {durationOptions.map((month) => (
                      <Button
                        key={month}
                        type="button"
                        variant={loanDuration === month ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLoanDuration(month)}
                        className={loanDuration === month ? "bg-primary text-white" : "text-gray-300"}
                      >
                        {month} {Number.parseInt(month) === 1 ? "month" : "months"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Release Percentage</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {percentageOptions.map((percent) => (
                      <Button
                        key={percent}
                        type="button"
                        variant={releasePercentage === percent ? "default" : "outline"}
                        size="sm"
                        onClick={() => setReleasePercentage(percent)}
                        className={releasePercentage === percent ? "bg-primary text-white" : "text-gray-300"}
                      >
                        {percent}%
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Total Asset Value</span>
                    <span className="font-medium">${totalAssetValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Loan Amount ({releasePercentage}%)</span>
                    <span className="font-medium">${loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Service Fee (1% × {loanDuration} months)</span>
                    <span className="font-medium">${serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">AED LST Equivalent</span>
                      <span className="font-medium text-primary">{aedEquivalent.toLocaleString()} AED</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Apply for Loan</Button>
              </TabsContent>

              <TabsContent value="lend" className="space-y-6">
                <div className="space-y-4">
                  <Label>Staking Duration</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {durationOptions.map((month) => (
                      <Button key={month} type="button" variant="outline" size="sm" className="text-gray-300">
                        {month} {Number.parseInt(month) === 1 ? "month" : "months"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stake-amount">Amount to Stake</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="stake-amount" type="number" defaultValue="10000" className="pl-9" />
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Expected APY Range</span>
                    <span className="font-medium">8-15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Estimated Min. Earnings</span>
                    <span className="font-medium">$400.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Estimated Max. Earnings</span>
                    <span className="font-medium">$750.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Pool Fee Split</span>
                    <span className="font-medium">50/50 with Treasury</span>
                  </div>
                </div>

                <div className="text-sm text-gray-400 p-3 border border-gray-700 rounded-lg">
                  <p>Earnings vary based on borrower activity. More borrowers = higher returns for lenders.</p>
                </div>

                <Button className="w-full">Stake Now</Button>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

