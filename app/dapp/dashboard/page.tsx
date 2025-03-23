"use client"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { useServices } from "@/hooks/use-services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Wallet, BarChart3, Clock } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { account, isConnected, connectWallet } = useBlockchain()
  const { assetService, stakingService, lendingService, projectService } = useServices()

  const [assets, setAssets] = useState([])
  const [stakedAssets, setStakedAssets] = useState([])
  const [loans, setLoans] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!isConnected || !account || !assetService || !stakingService || !lendingService || !projectService) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        const [userAssets, userStakedAssets, userLoans, allProjects] = await Promise.all([
          assetService.getAllUserAssets(account),
          stakingService.getStakedAssets(account),
          lendingService.getUserLoans(account),
          projectService.getAllProjects(),
        ])

        setAssets(userAssets)
        setStakedAssets(userStakedAssets)
        setLoans(userLoans)
        setProjects(allProjects)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [account, isConnected, assetService, stakingService, lendingService, projectService])

  // Sample data for charts
  const portfolioData = [
    { name: "T-Bonds", value: 45 },
    { name: "Property", value: 30 },
    { name: "Staking", value: 15 },
    { name: "Lending", value: 10 },
  ]

  const activityData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
    { name: "Jul", value: 7000 },
  ]

  const COLORS = ["#FF5722", "#2196F3", "#4CAF50", "#FFC107"]

  const stats = [
    {
      title: "Total Value",
      value: "$12,345.67",
      change: "+5.2%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Active Investments",
      value: "7",
      change: "+2",
      trend: "up",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Staking Rewards",
      value: "$345.12",
      change: "+12.3%",
      trend: "up",
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      title: "Next Payout",
      value: "2d 14h",
      change: "",
      trend: "neutral",
      icon: <Clock className="h-5 w-5" />,
    },
  ]

  const recentTransactions = [
    {
      id: "tx1",
      type: "Staking Reward",
      amount: "+0.05 ETH",
      date: "Today, 10:45 AM",
      status: "completed",
    },
    {
      id: "tx2",
      type: "T-Bond Purchase",
      amount: "-2.5 ETH",
      date: "Yesterday, 3:20 PM",
      status: "completed",
    },
    {
      id: "tx3",
      type: "Property Token Sale",
      amount: "+1.2 ETH",
      date: "Jul 20, 2023",
      status: "completed",
    },
    {
      id: "tx4",
      type: "Lending Interest",
      amount: "+0.03 ETH",
      date: "Jul 19, 2023",
      status: "completed",
    },
  ]

  if (!isConnected) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl">Connect your wallet to access the dashboard.</p>
            <Button size="lg" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Kolam Prosper</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline">Export Data</Button>
          <Button>Add Funds</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-primary/10">{stat.icon}</div>
                {stat.trend !== "neutral" && (
                  <div className={`flex items-center ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-sm">{stat.change}</span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <h3 className="text-muted-foreground text-sm">{stat.title}</h3>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Your investment activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF5722" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Distribution of your investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.amount.startsWith("+")
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {transaction.amount.startsWith("+") ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.type}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.amount.startsWith("+") ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.amount}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dapp/assets" className="w-full">
              <Button className="w-full justify-between group">
                <span>Buy T-Bonds</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>
            <Link href="/dapp/staking" className="w-full">
              <Button className="w-full justify-between group">
                <span>Stake Tokens</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>
            <Link href="/dapp/lending" className="w-full">
              <Button className="w-full justify-between group">
                <span>Provide Liquidity</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>
            <Link href="/dapp/staking" className="w-full">
              <Button className="w-full justify-between group">
                <span>Claim Rewards</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

