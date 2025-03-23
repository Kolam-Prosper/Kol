"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center">
            <div className="text-2xl font-bold tracking-tighter">
              Kolam<span className="text-primary">Prosper</span>
            </div>
            <div className="text-sm text-gray-300 mt-0.5 font-medium">كولام بروسبر</div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-sm hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#products" className="text-sm hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="#staking" className="text-sm hover:text-primary transition-colors">
              Staking
            </Link>
            <Link href="#lending" className="text-sm hover:text-primary transition-colors">
              Lending
            </Link>
            <Link href="#investments" className="text-sm hover:text-primary transition-colors">
              Investments
            </Link>
            <Link href="/whitepaper" className="text-sm hover:text-primary transition-colors">
              Whitepaper
            </Link>
            <Link href="/pitchdeck" className="text-sm hover:text-primary transition-colors">
              Pitch Deck
            </Link>
            <Link href="/dapp">
              <Button
                variant="outline"
                className="ml-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Launch App
              </Button>
            </Link>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex flex-col"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
              <Link href="/" className="flex flex-col items-center">
                <div className="text-xl font-bold">
                  Kolam<span className="text-primary">Prosper</span>
                </div>
                <div className="text-sm text-gray-300 mt-0.5">كولام بروسبر</div>
              </Link>
              <Link href="#about" className="text-2xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="#products" className="text-2xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Products
              </Link>
              <Link href="#staking" className="text-2xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Staking
              </Link>
              <Link href="#lending" className="text-2xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Lending
              </Link>
              <Link href="#investments" className="text-2xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Investments
              </Link>
              <Link href="/whitepaper" className="text-2xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Whitepaper
              </Link>
              <Link href="/pitchdeck" className="text-2xl font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Pitch Deck
              </Link>
              <Link href="/dapp">
                <Button
                  variant="default"
                  size="lg"
                  className="mt-8 bg-primary hover:bg-primary/90 text-black font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Launch App
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

