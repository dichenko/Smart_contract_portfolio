
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();


async function main() {
  let marketplace: Contract;
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();
  const MarketplaceFactory = await ethers.getContractFactory("Marketplace");


  
  marketplace = await MarketplaceFactory.deploy(
    process.env.ERC20_CONTRACT_ADDRESS as string,
    process.env.ERC721_CONTRACT_ADDRESS as string,
    process.env.ERC1155_CONTRACT_ADDRESS as string,
    owner.address
  );
  marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
