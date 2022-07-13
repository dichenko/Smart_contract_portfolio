import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  let myERC721: Contract;
  let owner: SignerWithAddress;

  [owner] = await ethers.getSigners();
  const MyERC721Factory = await ethers.getContractFactory("MyERC721");
  myERC721 = await MyERC721Factory.deploy();
  myERC721.deployed();
  

  console.log("ERC721deployed to:", myERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
