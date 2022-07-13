import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  let marketplace: Contract;
  let owner: SignerWithAddress;

  [owner] = await ethers.getSigners();
  const MarketplaceFactory = await ethers.getContractFactory("MyERC20");
  marketplace = await MarketplaceFactory.deploy(erc20.address, erc721.address, erc1155.address, creator.address);
  marketplace.deployed();
  

  console.log("Marketplace deployed to:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
