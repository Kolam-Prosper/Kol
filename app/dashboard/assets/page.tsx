"use client"

import { useState, useEffect } from "react"
import { useBlockchain } from "@/context/blockchain-context"
import { useServices } from "@/hooks/use-services"
import type { Asset } from "@/services/asset-service"
import type { StakedAsset } from "@/services/staking-service"
import type { Loan } from "@/services/lending-service"
import type { Project } from "@/services/project-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Dashboard() {
  const { account, isConnected, connectWallet } = useBlockchain()
  const { assetService, stakingService, lendingService, projectService } = useServices()

  const [assets, setAssets] = useState<Asset[]>([])
  const [stakedAssets, setStakedAssets] = useState<StakedAsset[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [projects, setProjects] = useState<Project[]>([])
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

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Connect your wallet to access the Kolam Prosper dashboard</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <p>Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Assets</CardTitle>
            <CardDescription>Your tokenized assets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{assets.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staked Assets</CardTitle>
            <CardDescription>Your staked assets</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stakedAssets.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Loans</CardTitle>
            <CardDescription>Your active loans</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{loans.filter((loan) => loan.active).length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="staking">Staking</TabsTrigger>
          <TabsTrigger value="lending">Lending</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          {assets.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Assets Found</CardTitle>
                <CardDescription>You don't have any tokenized assets yet</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Tokenize Asset</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <Card key={asset.id}>
                  <CardHeader>
                    <CardTitle>{asset.type === "tbond" ? "T-Bond" : "Property Deed"}</CardTitle>
                    <CardDescription>Token ID: {asset.id}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {asset.metadata ? (
                      <>
                        <p className="mb-2">{asset.metadata.name}</p>
                        <p className="mb-2">{asset.metadata.description}</p>
                        {asset.metadata.image && (
                          <img
                            src={asset.metadata.image || "/placeholder.svg"}
                            alt={asset.metadata.name}
                            className="w-full h-40 object-cover rounded-md mb-2"
                          />
                        )}
                      </>
                    ) : (
                      <p className="mb-2">Metadata not available</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">View Details</Button>
                    <Button>Use Asset</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="staking">
          {stakedAssets.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Staked Assets</CardTitle>
                <CardDescription>You don't have any staked assets yet</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Stake an Asset</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stakedAssets.map((asset) => (
                <Card key={asset.tokenId}>
                  <CardHeader>
                    <CardTitle>{asset.assetType === "tbond" ? "T-Bond" : "Property Deed"}</CardTitle>
                    <CardDescription>Token ID: {asset.tokenId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Staked At:</span>
                        <span className="font-medium">{asset.stakedAt.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">{asset.duration / (24 * 60 * 60)} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rewards:</span>
                        <span className="font-medium">{asset.rewards} AED</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => stakingService?.unstakeAsset(asset.tokenId)}>Unstake</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lending">
          {loans.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Loans Found</CardTitle>
                <CardDescription>You don't have any loans yet</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Get a Loan</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loans.map((loan) => (
                <Card key={loan.id}>
                  <CardHeader>
                    <CardTitle>Loan #{loan.id}</CardTitle>
                    <CardDescription>Asset ID: {loan.tokenId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-medium">{loan.amount} AED</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span className="font-medium">{loan.startTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span className="font-medium">{loan.endTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium">{loan.active ? "Active" : "Inactive"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button disabled={!loan.active} onClick={() => lendingService?.repayLoan(loan.id)}>
                      Repay Loan
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects">
          {projects.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Projects Found</CardTitle>
                <CardDescription>There are no investment projects available</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button>Create Project</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Target Amount:</span>
                        <span className="font-medium">{project.targetAmount} AED</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Raised Amount:</span>
                        <span className="font-medium">{project.raisedAmount} AED</span>
                      </div>
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span className="font-medium">{project.endTime.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium">{project.active ? "Active" : "Closed"}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button disabled={!project.active}>Invest</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

