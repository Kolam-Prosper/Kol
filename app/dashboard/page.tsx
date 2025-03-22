"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/context/wallet-context"
import { ConnectWalletModal } from "@/components/connect-wallet-modal"
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

export default function DashboardPage() {
  const { isConnected } = useWallet()
  const [showConnectModal, setShowConnectModal] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      setShowConnectModal(true)
    }
  }, [isConnected])

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

  return (
    <>
      <ConnectWalletModal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} />

      <div className="p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Welcome to Kolam Prosper</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="outline" className="border-gray-700">
              Export Data
            </Button>
            <Button>Add Funds</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
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
                  <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your investment activity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#F9FAFB" }}
                      itemStyle={{ color: "#F9FAFB" }}
                      labelStyle={{ color: "#F9FAFB" }}
                    />
                    <Bar dataKey="value" fill="#FF5722" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
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
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#F9FAFB" }}
                      itemStyle={{ color: "#F9FAFB" }}
                      labelStyle={{ color: "#F9FAFB" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
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
                        <p className="text-sm text-gray-400">{transaction.date}</p>
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
                      <p className="text-xs text-gray-400 uppercase">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-gray-700">
                View All Transactions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-between group">
                <span>Buy T-Bonds</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
              <Button className="w-full justify-between group">
                <span>Stake Tokens</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
              <Button className="w-full justify-between group">
                <span>Provide Liquidity</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
              <Button className="w-full justify-between group">
                <span>Claim Rewards</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

