import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  let myERC20: Contract;
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();
  const MyERC20Factory = await ethers.getContractFactory("Marketplace");
  myERC20 = await MyERC20Factory.deploy("MarketplaseTokens", "MPT", 18, ethers.utils.parseEther("10000000000"));
  myERC20.deployed();
  console.log("ERC20 deployed to:", myERC20.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
