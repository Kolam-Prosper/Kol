"use client"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"
import { Wallet, ArrowLeft } from "lucide-react"

// Extended project interface with additional fields
interface Project {
  id: string
  name: string
  description: string
  targetAmount: string
  raisedAmount: string
  endTime: Date
  active: boolean
  apy: string
  minInvestment: string
  riskLevel: "Low" | "Medium" | "Medium-High" | "High"
  duration: string
}

// Predefined projects data
const predefinedProjects: Project[] = [
  {
    id: "gold-transport",
    name: "Gold Transportation",
    description: "Secure transportation of gold between UAE and international markets",
    targetAmount: "3,670,000",
    raisedAmount: "1,835,000",
    endTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    active: true,
    apy: "10%",
    minInvestment: "3,670 AED",
    riskLevel: "Medium",
    duration: "3 months",
  },
  {
    id: "farming-extension",
    name: "Farming Extension",
    description: "Expansion of vertical farming operations in Dubai",
    targetAmount: "367,000",
    raisedAmount: "110,100",
    endTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    active: true,
    apy: "20%",
    minInvestment: "36,700 AED",
    riskLevel: "High",
    duration: "12 months",
  },
  {
    id: "rent-to-buy",
    name: "Rent-to-Buy Homes",
    description: "Affordable housing initiative with rent-to-buy option",
    targetAmount: "36,700,000",
    raisedAmount: "18,350,000",
    endTime: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    active: true,
    apy: "10%",
    minInvestment: "3,670 AED",
    riskLevel: "Low",
    duration: "6 months",
  },
  {
    id: "commercial-property",
    name: "Commercial Property",
    description: "Development of commercial property in Abu Dhabi business district",
    targetAmount: "3,670,000",
    raisedAmount: "2,202,000",
    endTime: new Date(Date.now() + 270 * 24 * 60 * 60 * 1000),
    active: true,
    apy: "15%",
    minInvestment: "36,700 AED",
    riskLevel: "Medium-High",
    duration: "9 months",
  },
  {
    id: "infrastructure",
    name: "Infrastructure Project",
    description: "Major infrastructure development in partnership with government",
    targetAmount: "36,700,000",
    raisedAmount: "11,010,000",
    endTime: new Date(Date.now() + 540 * 24 * 60 * 60 * 1000),
    active: true,
    apy: "12%",
    minInvestment: "367,000 AED",
    riskLevel: "Medium",
    duration: "18 months",
  },
]

export default function InvestmentsPage() {
  const { account, isConnected, connectWallet } = useBlockchain()
  const { toast } = useToast()

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [investAmount, setInvestAmount] = useState("0.0")
  const [aedLstBalance, setAedLstBalance] = useState("0.0")
  const [isLoading, setIsLoading] = useState(true)
  const [isInvesting, setIsInvesting] = useState(false)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // Form state for creating a project
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectTarget, setProjectTarget] = useState("")
  const [projectMinInvestment, setProjectMinInvestment] = useState("")
  const [projectDuration, setProjectDuration] = useState("3 months")
  const [projectAPY, setProjectAPY] = useState("")
  const [projectRiskLevel, setProjectRiskLevel] = useState("Medium")

  useEffect(() => {
    async function fetchData() {
      if (!isConnected || !account) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        // Set admin status - for demo purposes, everyone is admin
        setIsAdmin(true)

        // Use predefined projects
        setProjects(predefinedProjects)

        // Set AED LST balance
        setAedLstBalance("125,750")
      } catch (error) {
        console.error("Error fetching investment data:", error)
        toast({
          title: "Error",
          description: "Failed to load investment data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [account, isConnected, toast])

  const handleInvest = async () => {
    if (!selectedProject || Number.parseFloat(investAmount.replace(/,/g, "")) <= 0) {
      toast({
        title: "Error",
        description: "Please select a project and enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    setIsInvesting(true)
    try {
      // Simulate investment transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Success!",
        description: `Invested ${investAmount} AED in project ${selectedProject.name}`,
      })

      // Update project's raised amount
      const updatedProjects = projects.map((project) => {
        if (project.id === selectedProject.id) {
          const currentRaised = Number.parseFloat(project.raisedAmount.replace(/,/g, ""))
          const newRaised = currentRaised + Number.parseFloat(investAmount.replace(/,/g, ""))
          return {
            ...project,
            raisedAmount: newRaised.toLocaleString(),
          }
        }
        return project
      })

      setProjects(updatedProjects)
      setSelectedProject(null)
      setInvestAmount("0.0")
    } catch (error) {
      console.error("Error investing:", error)
      toast({
        title: "Error",
        description: "Failed to complete investment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsInvesting(false)
    }
  }

  const handleCreateProject = async () => {
    // Validate form
    if (
      !projectName ||
      !projectDescription ||
      !projectTarget ||
      !projectMinInvestment ||
      !projectDuration ||
      !projectAPY
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreatingProject(true)
    try {
      // Simulate project creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create new project
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: projectName,
        description: projectDescription,
        targetAmount: projectTarget,
        raisedAmount: "0",
        endTime: new Date(Date.now() + getDurationInDays(projectDuration) * 24 * 60 * 60 * 1000),
        active: true,
        apy: `${projectAPY}%`,
        minInvestment: `${projectMinInvestment} AED`,
        riskLevel: projectRiskLevel as any,
        duration: projectDuration,
      }

      setProjects([newProject, ...projects])

      toast({
        title: "Success!",
        description: `Project "${projectName}" created successfully!`,
      })

      // Reset form
      setProjectName("")
      setProjectDescription("")
      setProjectTarget("")
      setProjectMinInvestment("")
      setProjectDuration("3 months")
      setProjectAPY("")
      setProjectRiskLevel("Medium")
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingProject(false)
    }
  }

  // Helper function to convert duration string to days
  const getDurationInDays = (duration: string): number => {
    const [amount, unit] = duration.split(" ")
    const months = Number.parseInt(amount)
    return months * 30 // Approximate days per month
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <h1 className="text-4xl font-bold mb-4">Connect Your Wallet</h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl">
              Connect your wallet to access investment opportunities.
            </p>
            <Button size="lg" onClick={connectWallet}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Investments</h1>
          <p className="text-muted-foreground">Invest your AED LST tokens in curated projects</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link href="/dapp">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            {account?.substring(0, 6)}...{account?.substring(38)}
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Your AED LST Balance</h2>
            <p className="text-3xl font-bold mt-2">{aedLstBalance} AED</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/dapp/staking">
              <Button>Earn More AED</Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs defaultValue="active-projects" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="active-projects">Active Projects</TabsTrigger>
          <TabsTrigger value="my-investments">My Investments</TabsTrigger>
          {isAdmin && <TabsTrigger value="create-project">Create Project</TabsTrigger>}
        </TabsList>

        <TabsContent value="active-projects">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>LST Investment Opportunities</CardTitle>
              <CardDescription>
                Explore our curated selection of Liquid Staking Token investments with competitive returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-primary/10">
                    <TableRow>
                      <TableHead className="font-semibold">Investment</TableHead>
                      <TableHead className="font-semibold">APY</TableHead>
                      <TableHead className="font-semibold">Min. Investment</TableHead>
                      <TableHead className="font-semibold">Risk Level</TableHead>
                      <TableHead className="font-semibold">Total Available</TableHead>
                      <TableHead className="font-semibold">Duration</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.slice(0, 5).map((project, index) => (
                      <TableRow key={project.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell className="text-primary">{project.apy}</TableCell>
                        <TableCell>{project.minInvestment}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              project.riskLevel === "Low"
                                ? "bg-green-500/20 text-green-500"
                                : project.riskLevel === "Medium"
                                  ? "bg-blue-500/20 text-blue-500"
                                  : project.riskLevel === "Medium-High"
                                    ? "bg-orange-500/20 text-orange-500"
                                    : "bg-red-500/20 text-red-500"
                            }`}
                          >
                            {project.riskLevel}
                          </span>
                        </TableCell>
                        <TableCell>{project.targetAmount} AED</TableCell>
                        <TableCell>{project.duration}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                            Invest
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 text-center">
                <Button variant="link">View All Investment Options</Button>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Active Projects</CardTitle>
                <CardDescription>There are no active investment projects at the moment</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="mb-4 relative w-24 h-24 opacity-50">
                  <Image src="/placeholder.svg?height=96&width=96" alt="No projects" width={96} height={96} />
                </div>
                <p className="text-center text-muted-foreground mb-4">
                  There are no active investment projects at the moment. Check back later or create your own project.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button>Create a Project</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=200&width=400')]"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="text-2xl font-bold text-white mb-1">{project.name}</h3>
                      <p className="text-white/80 mb-2">{project.description}</p>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Funding Progress</span>
                          <span>
                            {(
                              (Number.parseFloat(project.raisedAmount.replace(/,/g, "")) /
                                Number.parseFloat(project.targetAmount.replace(/,/g, ""))) *
                              100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (Number.parseFloat(project.raisedAmount.replace(/,/g, "")) /
                              Number.parseFloat(project.targetAmount.replace(/,/g, ""))) *
                            100
                          }
                          className="h-2"
                        />
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-muted-foreground">{project.raisedAmount} AED raised</span>
                          <span className="text-muted-foreground">Target: {project.targetAmount} AED</span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">APY</span>
                        <span className="font-medium text-primary">{project.apy}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Investment</span>
                        <span className="font-medium">{project.minInvestment}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Level</span>
                        <span
                          className={`font-medium ${
                            project.riskLevel === "Low"
                              ? "text-green-500"
                              : project.riskLevel === "Medium"
                                ? "text-blue-500"
                                : project.riskLevel === "Medium-High"
                                  ? "text-orange-500"
                                  : "text-red-500"
                          }`}
                        >
                          {project.riskLevel}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{project.duration}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date</span>
                        <span className="font-medium">{project.endTime.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={!project.active} onClick={() => setSelectedProject(project)}>
                      Invest
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {selectedProject && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Invest in {selectedProject.name}</CardTitle>
                  <CardDescription>{selectedProject.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="invest-amount">Investment Amount (AED)</Label>
                      <Input
                        id="invest-amount"
                        type="text"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">Your balance: {aedLstBalance} AED</p>
                      <p className="text-sm text-muted-foreground">
                        Minimum investment: {selectedProject.minInvestment}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected APY</span>
                        <span className="font-medium text-primary">{selectedProject.apy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk Level</span>
                        <span
                          className={`font-medium ${
                            selectedProject.riskLevel === "Low"
                              ? "text-green-500"
                              : selectedProject.riskLevel === "Medium"
                                ? "text-blue-500"
                                : selectedProject.riskLevel === "Medium-High"
                                  ? "text-orange-500"
                                  : "text-red-500"
                          }`}
                        >
                          {selectedProject.riskLevel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{selectedProject.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Target</span>
                        <span className="font-medium">{selectedProject.targetAmount} AED</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Raised So Far</span>
                        <span className="font-medium">{selectedProject.raisedAmount} AED</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date</span>
                        <span className="font-medium">{selectedProject.endTime.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelectedProject(null)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      Number.parseFloat(investAmount.replace(/,/g, "")) <= 0 ||
                      Number.parseFloat(investAmount.replace(/,/g, "")) >
                        Number.parseFloat(aedLstBalance.replace(/,/g, "")) ||
                      isInvesting
                    }
                    onClick={handleInvest}
                  >
                    {isInvesting ? "Processing..." : "Confirm Investment"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-investments">
          <Card>
            <CardHeader>
              <CardTitle>My Investments</CardTitle>
              <CardDescription>Track your investments and returns</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 relative w-24 h-24 opacity-50">
                <Image src="/placeholder.svg?height=96&width=96" alt="No investments" width={96} height={96} />
              </div>
              <p className="text-center text-muted-foreground mb-4">
                You haven't made any investments yet. Browse active projects to start investing.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => document.querySelector('[data-value="active-projects"]')?.click()}>
                Browse Projects
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="create-project">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Project</CardTitle>
                <CardDescription>Launch your own investment opportunity</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      placeholder="Enter project name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-description">Description</Label>
                    <textarea
                      id="project-description"
                      className="w-full min-h-[100px] p-2 rounded-md border bg-background"
                      placeholder="Describe your project"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-target">Target Amount (AED)</Label>
                      <Input
                        id="project-target"
                        type="text"
                        placeholder="e.g., 1,000,000"
                        value={projectTarget}
                        onChange={(e) => setProjectTarget(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-min-investment">Minimum Investment (AED)</Label>
                      <Input
                        id="project-min-investment"
                        type="text"
                        placeholder="e.g., 10,000"
                        value={projectMinInvestment}
                        onChange={(e) => setProjectMinInvestment(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-duration">Duration</Label>
                      <Select value={projectDuration} onValueChange={setProjectDuration}>
                        <SelectTrigger id="project-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3 months">3 months</SelectItem>
                          <SelectItem value="6 months">6 months</SelectItem>
                          <SelectItem value="9 months">9 months</SelectItem>
                          <SelectItem value="12 months">12 months</SelectItem>
                          <SelectItem value="18 months">18 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="project-apy">Expected APY (%)</Label>
                      <Input
                        id="project-apy"
                        type="text"
                        placeholder="e.g., 10"
                        value={projectAPY}
                        onChange={(e) => setProjectAPY(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-risk">Risk Level</Label>
                    <Select value={projectRiskLevel} onValueChange={setProjectRiskLevel}>
                      <SelectTrigger id="project-risk">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Medium-High">Medium-High</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleCreateProject} disabled={isCreatingProject}>
                  {isCreatingProject ? "Creating Project..." : "Create Project"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

