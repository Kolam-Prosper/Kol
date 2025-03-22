"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowRight, Percent, DollarSign, Clock } from "lucide-react"

export function Lending() {
  const [loanAmount, setLoanAmount] = useState(5000)
  const [collateralRatio, setCollateralRatio] = useState(150)
  const [loanTerm, setLoanTerm] = useState(30)

  // Calculate estimated interest based on inputs
  const interestRate = 5 + (200 - collateralRatio) * 0.05
  const interestAmount = (loanAmount * interestRate * loanTerm) / (100 * 365)

  return (
    <section id="lending" className="py-20 md:py-32 bg-black relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="container mx-auto px-4">
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
            Access liquidity without selling your assets or earn interest by lending your tokens
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">Unlock the Value of Your Assets</h3>
            <p className="text-gray-300 mb-8">
              Our lending platform allows you to use your tokenized assets as collateral to access instant loans, or
              earn passive income by providing liquidity to borrowers.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Competitive Rates</h4>
                  <p className="text-sm text-gray-400">
                    Get loans at rates as low as 3% APR or earn up to 12% APY as a lender
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
                    Choose loan durations from 1 day to 365 days with customizable repayment options
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-full bg-primary/10 text-primary mr-4">
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Adjustable Collateral</h4>
                  <p className="text-sm text-gray-400">
                    Set your own collateral ratio from 120% to 200% to manage risk and interest rates
                  </p>
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
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Loan Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="loan-amount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="collateral-ratio">Collateral Ratio</Label>
                    <span className="text-sm text-gray-400">{collateralRatio}%</span>
                  </div>
                  <Slider
                    id="collateral-ratio"
                    min={120}
                    max={200}
                    step={5}
                    value={[collateralRatio]}
                    onValueChange={(value) => setCollateralRatio(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>120%</span>
                    <span>200%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="loan-term">Loan Term (Days)</Label>
                    <span className="text-sm text-gray-400">{loanTerm} days</span>
                  </div>
                  <Slider
                    id="loan-term"
                    min={1}
                    max={90}
                    step={1}
                    value={[loanTerm]}
                    onValueChange={(value) => setLoanTerm(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 day</span>
                    <span>90 days</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Interest Rate</span>
                    <span className="font-medium">{interestRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Required Collateral</span>
                    <span className="font-medium">${((loanAmount * collateralRatio) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Estimated Interest</span>
                    <span className="font-medium">${interestAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full">Apply for Loan</Button>
              </TabsContent>

              <TabsContent value="lend" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="lend-amount">Amount to Lend</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="lend-amount" type="number" defaultValue="10000" className="pl-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="lending-term">Lending Term</Label>
                    <span className="text-sm text-gray-400">30 days</span>
                  </div>
                  <Slider id="lending-term" min={1} max={90} step={1} defaultValue={[30]} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 day</span>
                    <span>90 days</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Expected APY</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Estimated Earnings</span>
                    <span className="font-medium">$69.86</span>
                  </div>
                </div>

                <Button className="w-full">Provide Liquidity</Button>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

