"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function LaunchApp() {
  return (
    <section className="py-20 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,59,0,0.15)_0,rgba(0,0,0,0)_70%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Revolutionize Your Financial Future?
          </motion.h2>

          <motion.p
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Access our platform now to start investing in tokenized T-bonds, property deeds or read our whitepaper for
            more information.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur-lg opacity-70 group-hover:opacity-100 transition duration-1000"></div>
              <Button
                size="lg"
                className="relative text-lg px-8 py-6 bg-black hover:bg-black/90 border border-primary/50 group"
                asChild
              >
                <Link href="/launch-app">
                  <span className="mr-2">Launch App</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-gray-700 hover:bg-gray-900">
              <span className="mr-2">Whitepaper</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

