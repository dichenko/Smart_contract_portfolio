import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  
  let myERC20: Contract;
  
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();
  
  //erc20 deploy
  const MyERC20Factory = await ethers.getContractFactory("BridgeToken");
  myERC20 = await MyERC20Factory.deploy();
  myERC20.deployed();
  console.log("ERC20 deployed to:", myERC20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
