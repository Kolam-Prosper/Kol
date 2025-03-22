"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export function Products() {
  const [activeTab, setActiveTab] = useState("t-bonds")

  const products = [
    {
      id: "t-bonds",
      title: "Tokenized T-Bonds",
      description:
        "Government treasury bonds transformed into digital tokens, providing unique opportunities to release equity as non-liquidating loans and/or invest further into other projects for higher rewards.",
      features: [
        "$1,000 buy-in, locked for 3 years",
        "Annual interest payments",
        "Secondary market trading",
        "Fixed return with no loss of value",
        "Equity release options",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "property",
      title: "Property Deed Tokens",
      description:
        "Digitized real estate deeds, purchase construction cost developments early with 30% returns within 18 months.",
      features: [
        "Options for equity release",
        "Up to 70% non-liquidating loan",
        "Equity options to further rewards into LST tokens",
        "Transparent ownership records",
        "Simplified property transfers",
      ],
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  const activeProduct = products.find((p) => p.id === activeTab)

  return (
    <section id="products" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Gain Access to Flexible Real-World Assets</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore our innovative tokenized assets that provide both security and flexibility for your investment
            portfolio
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <div className="flex space-x-4 mb-8">
              {products.map((product) => (
                <Button
                  key={product.id}
                  variant={activeTab === product.id ? "default" : "outline"}
                  onClick={() => setActiveTab(product.id)}
                  className="relative"
                >
                  {product.title}
                  {activeTab === product.id && (
                    <motion.div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" layoutId="activeTab" />
                  )}
                </Button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold mb-4">{activeProduct?.title}</h3>
                <p className="text-gray-300 mb-6">{activeProduct?.description}</p>

                <ul className="space-y-3 mb-8">
                  {activeProduct?.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ChevronRight className="h-5 w-5 text-primary mr-2 shrink-0" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button>Learn More</Button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full md:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="relative rounded-lg overflow-hidden border border-gray-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10" />
                <img
                  src={activeProduct?.image || "/placeholder.svg"}
                  alt={activeProduct?.title}
                  className="w-full h-auto"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

