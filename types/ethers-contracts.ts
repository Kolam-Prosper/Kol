import { Contract, type Signer } from "ethers"

// Dummy factory class for IERC20
export class IERC20__factory {
  static connect(address: string, signer?: Signer): Contract {
    // Return a dummy contract object
    return new Contract(address, [], signer)
  }
}

