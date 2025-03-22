"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Building, TrendingUp, LineChart } from "lucide-react"

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="about" className="py-20 md:py-32 bg-black relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Redefining Asset Ownership in the Digital Age
          </motion.h2>

          <motion.p
            className="text-lg text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            At Kolam Prosper, we're bridging traditional finance with blockchain technology, creating a more accessible,
            transparent, and efficient financial ecosystem.
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
            variants={itemVariants}
          >
            <Building className="h-12 w-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-4">Premium Properties</h3>
            <p className="text-gray-400">
              Access high-value real estate in prime UAE locations, carefully selected for optimal returns.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
            variants={itemVariants}
          >
            <TrendingUp className="h-12 w-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-4">Instant Liquidity</h3>
            <p className="text-gray-400">
              Transform illiquid assets into tradable tokens, unlocking immediate value and creating new opportunities
              for investors.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800"
            variants={itemVariants}
          >
            <LineChart className="h-12 w-12 text-primary mb-6" />
            <h3 className="text-xl font-semibold mb-4">Competitive Returns</h3>
            <p className="text-gray-400">
              Enjoy attractive annual yields from your real estate investments, outperforming traditional markets.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

