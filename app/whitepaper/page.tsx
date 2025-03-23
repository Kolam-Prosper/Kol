"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState("introduction")

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kolam Prosper Whitepaper</h1>
          <p className="text-muted-foreground">Technical documentation and project overview</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-1">
                <h3 className="font-medium text-lg mb-4">Table of Contents</h3>
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant={activeSection === "introduction" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("introduction")}
                    >
                      1. Introduction
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeSection === "vision" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("vision")}
                    >
                      2. Vision & Mission
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeSection === "technology" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("technology")}
                    >
                      3. Technology
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeSection === "tokenomics" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("tokenomics")}
                    >
                      4. Tokenomics
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeSection === "roadmap" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("roadmap")}
                    >
                      5. Roadmap
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeSection === "team" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("team")}
                    >
                      6. Team
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeSection === "conclusion" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection("conclusion")}
                    >
                      7. Conclusion
                    </Button>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6">
              {activeSection === "introduction" && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                  <p className="mb-4">
                    Kolam Prosper represents a paradigm shift in how real-world assets are tokenized, traded, and
                    utilized within the decentralized finance ecosystem. Our platform bridges the gap between
                    traditional finance and blockchain technology, enabling the tokenization of treasury bonds and
                    property deeds.
                  </p>
                  <p className="mb-4">
                    This whitepaper outlines our vision, technology stack, tokenomics, and roadmap for creating a
                    comprehensive ecosystem that allows users to purchase, stake, borrow against, and invest in
                    tokenized real-world assets.
                  </p>
                  <p>
                    By leveraging the Unichain blockchain, we provide a secure, transparent, and efficient platform for
                    accessing previously illiquid assets, democratizing access to high-quality investment opportunities
                    that were traditionally reserved for institutional investors.
                  </p>
                </div>
              )}

              {activeSection === "vision" && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">2. Vision & Mission</h2>
                  <p className="mb-4">
                    <strong>Vision:</strong> To create a world where all valuable assets are accessible, liquid, and
                    tradable by anyone, anywhere, at any time.
                  </p>
                  <p className="mb-4">
                    <strong>Mission:</strong> To democratize access to premium financial instruments by tokenizing
                    real-world assets and providing a comprehensive platform for trading, staking, borrowing, and
                    investing.
                  </p>
                  <p>
                    Kolam Prosper aims to bridge the gap between traditional finance and decentralized finance, bringing
                    the benefits of blockchain technology to real-world assets while maintaining compliance with
                    regulatory frameworks.
                  </p>
                </div>
              )}

              {activeSection === "technology" && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">3. Technology</h2>
                  <p className="mb-4">
                    Kolam Prosper is built on the Unichain blockchain, leveraging its security, scalability, and
                    interoperability features. Our platform consists of several key components:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Asset Tokenization Protocol:</strong> Our proprietary protocol for converting real-world
                      assets into blockchain tokens while maintaining legal compliance.
                    </li>
                    <li className="mb-2">
                      <strong>Staking Vault:</strong> A secure system for staking tokenized assets to earn AED LST
                      (Liquid Staking Tokens).
                    </li>
                    <li className="mb-2">
                      <strong>Lending Vault:</strong> A protocol that enables users to borrow against their tokenized
                      assets without selling them.
                    </li>
                    <li className="mb-2">
                      <strong>Investment Platform:</strong> A curated marketplace for investing AED LST in various
                      projects with different risk-return profiles.
                    </li>
                  </ul>
                  <p>
                    All smart contracts are audited by leading security firms to ensure the highest standards of
                    security and reliability.
                  </p>
                </div>
              )}

              {activeSection === "tokenomics" && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">4. Tokenomics</h2>
                  <p className="mb-4">The Kolam Prosper ecosystem features two primary token types:</p>
                  <h3 className="text-xl font-semibold mb-2">Tokenized Assets</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>T-Bonds:</strong> Tokenized treasury bonds with fixed returns and 3-year maturity.
                    </li>
                    <li className="mb-2">
                      <strong>Property Deeds:</strong> Tokenized real estate assets with potential for capital
                      appreciation and rental income.
                    </li>
                  </ul>
                  <h3 className="text-xl font-semibold mb-2">AED LST (Liquid Staking Token)</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li className="mb-2">
                      <strong>Utility:</strong> Used for governance, investment in projects, and as a medium of exchange
                      within the ecosystem.
                    </li>
                    <li className="mb-2">
                      <strong>Earning:</strong> Obtained by staking tokenized assets in the Staking Vault.
                    </li>
                    <li className="mb-2">
                      <strong>Value Accrual:</strong> Backed by the underlying staked assets, with value increasing as
                      the platform grows.
                    </li>
                  </ul>
                </div>
              )}

              {activeSection === "roadmap" && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">5. Roadmap</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Q1 2023: Foundation</h3>
                      <ul className="list-disc pl-6">
                        <li>Platform architecture design</li>
                        <li>Smart contract development</li>
                        <li>Legal framework establishment</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Q2 2023: Alpha Launch</h3>
                      <ul className="list-disc pl-6">
                        <li>Testnet deployment</li>
                        <li>Security audits</li>
                        <li>Private alpha testing</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Q3 2023: Beta Launch</h3>
                      <ul className="list-disc pl-6">
                        <li>Public beta release</li>
                        <li>Initial asset tokenization</li>
                        <li>Staking functionality</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Q4 2023: Full Launch</h3>
                      <ul className="list-disc pl-6">
                        <li>Lending vault activation</li>
                        <li>Investment platform launch</li>
                        <li>Mobile app release</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">2024: Expansion</h3>
                      <ul className="list-disc pl-6">
                        <li>Additional asset classes</li>
                        <li>Cross-chain integration</li>
                        <li>Institutional partnerships</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "team" && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">6. Team</h2>
                  <p className="mb-4">
                    Kolam Prosper is led by a team of experts in blockchain technology, finance, real estate, and legal
                    compliance:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Ahmed Al Maktoum</h3>
                      <p className="text-sm text-muted-foreground mb-2">Founder & CEO</p>
                      <p className="text-sm">
                        15+ years in finance and real estate development. Former executive at Dubai Investment
                        Authority.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Sarah Chen</h3>
                      <p className="text-sm text-muted-foreground mb-2">CTO</p>
                      <p className="text-sm">
                        Blockchain architect with experience at Ethereum Foundation and Consensys. PhD in Distributed
                        Systems.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Michael Rodriguez</h3>
                      <p className="text-sm text-muted-foreground mb-2">CFO</p>
                      <p className="text-sm">
                        Former investment banker with Goldman Sachs. MBA from Harvard Business School.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Aisha Al Zaabi</h3>
                      <p className="text-sm text-muted-foreground mb-2">Chief Legal Officer</p>
                      <p className="text-sm">
                        Specialized in financial regulations and blockchain compliance. JD from Yale Law School.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "conclusion" && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold mb-4">7. Conclusion</h2>
                  <p className="mb-4">
                    Kolam Prosper represents a significant advancement in the tokenization of real-world assets,
                    providing a comprehensive platform for purchasing, staking, borrowing against, and investing in
                    tokenized treasury bonds and property deeds.
                  </p>
                  <p className="mb-4">
                    By bridging traditional finance with blockchain technology, we are democratizing access to premium
                    financial instruments and creating new opportunities for wealth creation and preservation.
                  </p>
                  <p className="mb-4">
                    We invite investors, partners, and users to join us on this journey to transform how real-world
                    assets are accessed, traded, and utilized in the digital age.
                  </p>
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">© 2023 Kolam Prosper. All rights reserved.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

