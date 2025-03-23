import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-100 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to Kolam DApp
        </p>
      </div>

      <div className="relative flex place-items-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Unichain Testnet</CardTitle>
            <CardDescription>Explore the Unichain Sepolia Testnet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="chain">Chain Name</Label>
                <Input id="chain" value="Unichain Sepolia" readOnly />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="chainId">Chain ID</Label>
                <Input id="chainId" value="1301" readOnly />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Learn More</Button>
            <Button>Connect Wallet</Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Gain access to flexible real world assets</h2>
        <Tabs defaultValue="tbonds" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="tbonds" className="data-[state=active]:bg-[#ff6b00] data-[state=active]:text-white">
              T-Bonds
            </TabsTrigger>
            <TabsTrigger value="deeds" className="data-[state=active]:bg-[#ff6b00] data-[state=active]:text-white">
              Deeds
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tbonds">T-Bonds Content</TabsContent>
          <TabsContent value="deeds">Deeds Content</TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

