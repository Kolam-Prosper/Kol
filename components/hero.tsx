"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { KolamDesign } from "./kolam-design"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  const router = useRouter()

  return (
    <motion.section
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity, scale, y }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,59,0,0.1),rgba(0,0,0,0)_70%)]"></div>
      </div>

      {/* Large Kolam Design in background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <KolamDesign width={1200} height={1200} opacity={0.3} color="#ff5722" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Revolutionizing Finance <br />
          <span className="text-primary">Through Tokenization</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Tokenized T-bonds and property deeds with secure staking and non-liquidating loan options. Unlock the
          potential of real-world assets on the blockchain.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button size="lg" className="mr-4" onClick={() => router.push("/launch-app")}>
            Launch App
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("#about")}>
            Learn More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <motion.div
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div
            className="w-1 h-2 bg-white rounded-full"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

