"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Linkedin, Send } from "lucide-react"
import { KolamDesign } from "./kolam-design"

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 relative overflow-hidden">
      {/* Single large kolam design in the background */}
      <div className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2">
        <KolamDesign width={400} height={400} opacity={0.15} color="#ff5722" />
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex flex-col items-start">
              <div className="text-2xl font-bold tracking-tighter mb-2">
                Kolam<span className="text-primary">Prosper</span>
              </div>
              <div className="text-sm text-gray-300 mb-4">كولام بروسبر</div>
            </Link>
            <p className="text-gray-400 mb-6">
              Creating prosperity for all with low-risk investments and easy liquidity release options.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  T-Bonds
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Property Deeds
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Staking
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Lending
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  LST Investments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
            <div className="flex">
              <Input type="email" placeholder="Your email" className="rounded-r-none bg-gray-900 border-gray-700" />
              <Button className="rounded-l-none">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Kolam Prosper. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-500 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white text-sm">
              Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

