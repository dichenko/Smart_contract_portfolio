import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  let bridge: Contract;
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();

  //marketplace deploy
  const BridgeFactory = await ethers.getContractFactory("Bridge");
  bridge = await BridgeFactory.deploy(
    process.env.ERC20_CONTRACT_ADDRESS as string,
    process.env.VALIDATOR_ADDRESS as string
  );
  bridge.deployed();
  console.log("Marketplace deployed to:", bridge.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
