import { ethers } from "ethers"

export interface Project {
  id: string
  address: string
  name: string
  description: string
  targetAmount: string // formatted amount
  raisedAmount: string // formatted amount
  startTime: Date
  endTime: Date
  active: boolean
}

export class ProjectService {
  private projectFactoryContract: ethers.Contract

  constructor(projectFactoryContract: ethers.Contract) {
    this.projectFactoryContract = projectFactoryContract
  }

  async getAllProjects(): Promise<Project[]> {
    try {
      const projectAddresses = await this.projectFactoryContract.getAllProjects()

      // This is a placeholder - you'd need to implement a way to get project details
      // In a real implementation, you'd create a contract instance for each project address
      // and fetch its details
      const projects: Project[] = projectAddresses.map((address: string, index: number) => ({
        id: index.toString(),
        address,
        name: `Project ${index}`,
        description: "Project description",
        targetAmount: "1000.0",
        raisedAmount: "500.0",
        startTime: new Date(),
        endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        active: true,
      }))

      return projects
    } catch (error) {
      console.error("Error fetching projects:", error)
      return []
    }
  }

  async createProject(
    name: string,
    description: string,
    targetAmount: string,
    durationDays: number,
  ): Promise<string | null> {
    try {
      const targetAmountInWei = ethers.parseEther(targetAmount)
      const durationInSeconds = durationDays * 24 * 60 * 60

      const tx = await this.projectFactoryContract.createProject(
        name,
        description,
        targetAmountInWei,
        durationInSeconds,
      )

      const receipt = await tx.wait()

      // This is a placeholder - you'd need to implement a way to get the created project address
      // In a real implementation, you'd extract it from the transaction receipt events
      const projectAddress = "0x..." // Placeholder

      return projectAddress
    } catch (error) {
      console.error("Error creating project:", error)
      return null
    }
  }
}

