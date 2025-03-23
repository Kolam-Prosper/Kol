"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Wallet, Landmark, PiggyBank, BarChart3, ChevronLeft, Menu, X, ShoppingBag } from "lucide-react"

export function DappNavigation({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/dapp", icon: Home },
    { name: "Marketplace", href: "/dapp/marketplace", icon: ShoppingBag },
    { name: "Assets", href: "/dapp/assets", icon: Wallet },
    { name: "Staking", href: "/dapp/staking", icon: Landmark },
    { name: "Lending", href: "/dapp/lending", icon: PiggyBank },
    { name: "Investments", href: "/dapp/investments", icon: BarChart3 },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 border-b bg-background md:hidden">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden w-64 flex-col border-r bg-background md:flex">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto p-4">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="border-t p-4">
            <p className="text-sm text-muted-foreground">© 2023 Kolam Prosper</p>
          </div>
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-3/4 bg-background p-4 shadow-lg">
              <nav className="flex-1 overflow-auto">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                      <li key={item.href}>
                        <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                          <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Button>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

