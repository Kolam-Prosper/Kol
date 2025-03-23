"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Kolam Prosper",
      subtitle: "Tokenizing Real-World Assets on the Blockchain",
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="mb-8 relative w-32 h-32">
            <Image
              src="/placeholder.svg?height=128&width=128"
              alt="Kolam Logo"
              width={128}
              height={128}
              className="opacity-80"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Kolam Prosper</h1>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl text-center">
            Tokenizing Real-World Assets on the Blockchain
          </p>
        </div>
      ),
    },
    {
      title: "The Problem",
      subtitle: "Illiquidity and Limited Access",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">The Problem</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold">Illiquid Assets</p>
                  <p className="text-muted-foreground">
                    Real estate and treasury bonds are highly illiquid, with long lock-up periods.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold">Limited Access</p>
                  <p className="text-muted-foreground">
                    High minimum investments create barriers for average investors.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold">Inefficient Markets</p>
                  <p className="text-muted-foreground">Slow, paper-based processes with multiple intermediaries.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-64">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Problem+Illustration"
                alt="Problem Illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Our Solution",
      subtitle: "Tokenization Platform",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <div className="flex items-center justify-center">
            <div className="relative w-full h-64">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Solution+Illustration"
                alt="Solution Illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold">Asset Tokenization</p>
                  <p className="text-muted-foreground">Converting real-world assets into blockchain tokens.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold">Comprehensive Platform</p>
                  <p className="text-muted-foreground">Purchase, stake, borrow, and invest all in one place.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold">Liquid Staking</p>
                  <p className="text-muted-foreground">Earn AED LST tokens by staking your tokenized assets.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Market Opportunity",
      subtitle: "Trillion-Dollar Potential",
      content: (
        <div className="flex flex-col h-full">
          <h2 className="text-3xl font-bold mb-6">Market Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">$100T</h3>
                <p className="text-muted-foreground">Global Real Estate Market</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">$128T</h3>
                <p className="text-muted-foreground">Global Bond Market</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">$3.2T</h3>
                <p className="text-muted-foreground">Tokenization Market by 2030</p>
              </CardContent>
            </Card>
          </div>
          <div className="relative w-full h-48 mt-auto">
            <Image
              src="/placeholder.svg?height=200&width=800&text=Market+Growth+Chart"
              alt="Market Growth Chart"
              fill
              className="object-contain"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Business Model",
      subtitle: "Multiple Revenue Streams",
      content: (
        <div className="flex flex-col h-full">
          <h2 className="text-3xl font-bold mb-6">Business Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Revenue Streams</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Tokenization Fees</span>
                    <span className="font-medium">2.5%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Transaction Fees</span>
                    <span className="font-medium">0.5%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Lending Interest</span>
                    <span className="font-medium">3-5%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Investment Management</span>
                    <span className="font-medium">1.5%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Projected Growth</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Year 1</span>
                      <span>$5M</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-[10%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Year 2</span>
                      <span>$15M</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-[30%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Year 3</span>
                      <span>$50M</span>
                    </div>
                    <div className="bg-muted rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 w-[60%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Competitive Advantage",
      subtitle: "What Sets Us Apart",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">Competitive Advantage</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold">Regulatory Compliance</p>
                  <p className="text-muted-foreground">Fully compliant with UAE and international regulations.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold">All-in-One Platform</p>
                  <p className="text-muted-foreground">Integrated ecosystem for all tokenized asset needs.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/20 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold">Strategic Partnerships</p>
                  <p className="text-muted-foreground">Exclusive agreements with government entities and developers.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-64">
              <Image
                src="/placeholder.svg?height=300&width=400&text=Competitive+Advantage"
                alt="Competitive Advantage"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Team",
      subtitle: "Experienced Leadership",
      content: (
        <div className="flex flex-col h-full">
          <h2 className="text-3xl font-bold mb-6">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    alt="Ahmed Al Maktoum"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Ahmed Al Maktoum</h3>
                  <p className="text-muted-foreground mb-2">Founder & CEO</p>
                  <p className="text-sm">15+ years in finance and real estate development.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                  <Image src="/placeholder.svg?height=80&width=80" alt="Sarah Chen" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sarah Chen</h3>
                  <p className="text-muted-foreground mb-2">CTO</p>
                  <p className="text-sm">Blockchain architect with experience at Ethereum Foundation.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    alt="Michael Rodriguez"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Michael Rodriguez</h3>
                  <p className="text-muted-foreground mb-2">CFO</p>
                  <p className="text-sm">Former investment banker with Goldman Sachs.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                  <Image src="/placeholder.svg?height=80&width=80" alt="Aisha Al Zaabi" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Aisha Al Zaabi</h3>
                  <p className="text-muted-foreground mb-2">Chief Legal Officer</p>
                  <p className="text-sm">Specialized in financial regulations and blockchain compliance.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Investment Opportunity",
      subtitle: "Join Our Vision",
      content: (
        <div className="flex flex-col h-full">
          <h2 className="text-3xl font-bold mb-6">Investment Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Funding Round</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Round</span>
                    <span className="font-medium">Series A</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Target</span>
                    <span className="font-medium">$10M</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pre-money Valuation</span>
                    <span className="font-medium">$50M</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Minimum Investment</span>
                    <span className="font-medium">$250K</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Use of Funds</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Product Development</span>
                    <span className="font-medium">40%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Marketing & User Acquisition</span>
                    <span className="font-medium">30%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Legal & Compliance</span>
                    <span className="font-medium">15%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Operations & Reserve</span>
                    <span className="font-medium">15%</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" className="px-8">
              Contact Us for Investment Details
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Thank You",
      subtitle: "Contact Information",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-3xl font-bold mb-6">Thank You</h2>
          <p className="text-xl mb-8 max-w-2xl">
            Join us in revolutionizing how real-world assets are tokenized, traded, and utilized.
          </p>
          <div className="mb-8">
            <p className="font-medium">Contact Information:</p>
            <p className="text-muted-foreground">info@kolamprosper.com</p>
            <p className="text-muted-foreground">+971 4 123 4567</p>
          </div>
          <Button size="lg" className="px-8">
            Schedule a Demo
          </Button>
        </div>
      ),
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? prev : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? prev : prev - 1))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kolam Prosper Pitch Deck</h1>
          <p className="text-muted-foreground">{slides[currentSlide].subtitle}</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-8 min-h-[60vh]">{slides[currentSlide].content}</CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentSlide === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <Button variant="outline" size="icon" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <Button
              key={index}
              variant={currentSlide === index ? "default" : "outline"}
              size="icon"
              className="w-2 h-2 p-0 rounded-full"
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

