
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  
  let dao: Contract;
  let erc20: Contract;
  let staking: Contract;
  let deployer: SignerWithAddress;

  [deployer] = await ethers.getSigners();
  
  //erc20 deploy
  const MyERC20Factory = await ethers.getContractFactory("GovernanceToken");
  erc20 = await MyERC20Factory.deploy();
  erc20.deployed();
  console.log("ERC20 deployed to:", erc20.address);


  //staking deploy
  const StakingFactory = await ethers.getContractFactory("Staking");
  staking = await StakingFactory.deploy();
  staking.deployed();
  console.log("Staking deployed to:", staking.address);


   //DAO deploy
   const DAOFactory = await ethers.getContractFactory("DAO");
   dao = await DAOFactory.deploy(erc20.address);
   dao.deployed();
   console.log("DAO deployed to:", dao.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
