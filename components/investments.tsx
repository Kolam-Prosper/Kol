"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

export function Investments() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const investments = [
    {
      name: "Gold Transportation",
      type: "LST",
      apy: "10%",
      minInvestment: "3,670 AED",
      risk: "Medium",
      trend: "up",
      available: "3,670,000 AED",
      duration: "3 months",
    },
    {
      name: "Farming Extension",
      type: "LST",
      apy: "20%",
      minInvestment: "36,700 AED",
      risk: "High",
      trend: "up",
      available: "367,000 AED",
      duration: "12 months",
    },
    {
      name: "Rent-to-Buy Homes",
      type: "LST",
      apy: "10%",
      minInvestment: "3,670 AED",
      risk: "Low",
      trend: "up",
      available: "36,700,000 AED",
      duration: "6 months",
    },
    {
      name: "Commercial Property",
      type: "LST",
      apy: "15%",
      minInvestment: "36,700 AED",
      risk: "Medium-High",
      trend: "up",
      available: "3,670,000 AED",
      duration: "9 months",
    },
    {
      name: "Infrastructure Project",
      type: "LST",
      apy: "12%",
      minInvestment: "367,000 AED",
      risk: "Medium",
      trend: "up",
      available: "36,700,000 AED",
      duration: "18 months",
    },
  ]

  return (
    <section id="investments" className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            LST Investment Opportunities
          </motion.h2>

          <motion.p
            className="text-lg text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore our curated selection of Liquid Staking Token investments with competitive returns
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="rounded-xl border border-gray-800 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-900/50">
                  <TableHead className="font-medium">Investment</TableHead>
                  <TableHead className="font-medium">APY</TableHead>
                  <TableHead className="font-medium">Min. Investment</TableHead>
                  <TableHead className="font-medium">Risk Level</TableHead>
                  <TableHead className="font-medium">Total Available</TableHead>
                  <TableHead className="font-medium">Duration</TableHead>
                  <TableHead className="font-medium"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment, index) => (
                  <TableRow key={index} className="border-gray-800 hover:bg-gray-900/30 transition-colors">
                    <TableCell className="font-medium">{investment.name}</TableCell>
                    <TableCell className="font-medium">{investment.apy}</TableCell>
                    <TableCell>{investment.minInvestment}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          investment.risk === "Low"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : investment.risk === "Medium"
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        }
                      >
                        {investment.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>{investment.available}</TableCell>
                    <TableCell>{investment.duration}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Button>View All Investment Options</Button>
        </motion.div>
      </div>
    </section>
  )
}

