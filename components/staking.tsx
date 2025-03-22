"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Lock, TrendingUp, Clock } from "lucide-react"

export function Staking() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const stakingOptions = [
    {
      title: "Auto Staking",
      description: "Your tokens are automatically earning interest",
      apy: "3-20%",
      icon: <TrendingUp className="h-6 w-6" />,
      features: ["3% APR T-bonds", "20% APR Property Deeds", "Equity release by time-locking staking or loan"],
    },
    {
      title: "Time-Locked Staking",
      description: "Opt for 1, 3, 6, 9, 12, or 18 months to release a percentage of your investment",
      apy: "10-15%",
      icon: <Lock className="h-6 w-6" />,
      features: ["Higher APY", "Earn further yield from UAE projects", "Compounding rewards"],
    },
    {
      title: "AED LST Stablecoin",
      description: "AED Liquid Staking Token is priced at 3.67 to $1",
      apy: "12-20%",
      icon: <Clock className="h-6 w-6" />,
      features: ["Fully backed currency", "No loss of peg", "Earn further AED by investing into projects"],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="staking" className="py-20 md:py-32 bg-gray-900 relative">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Maximize Your Returns with Staking
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stake your tokenized assets to earn further passive income by contributing to projects or governance within
            the protocol.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stakingOptions.map((option, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">{option.icon}</div>
                    <div className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      APY: {option.apy}
                    </div>
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription className="text-gray-400">{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full group">
                    Start Staking
                    <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Button variant="outline" size="lg">
            View All Staking Options
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

