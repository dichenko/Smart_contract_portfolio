import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  let staking: Contract;
  let deployer: SignerWithAddress;

  [deployer] = await ethers.getSigners();

  //staking deploy
  const StakingFactory = await ethers.getContractFactory("Staking");
  staking = await StakingFactory.deploy();
  staking.deployed();
  console.log("Staking deployed to:", staking.address);
  console.log("grant role Dao");
  await staking.grantRole(staking.DAO(), process.env.DAO_ADDRESS as string);
  console.log("Dao granted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
