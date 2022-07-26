import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  let pandaNft: Contract;
  let owner: SignerWithAddress;

  [owner] = await ethers.getSigners();
  const PandaNftFactory = await ethers.getContractFactory("PandaNFT");
  pandaNft = await PandaNftFactory.deploy();
  pandaNft.deployed();

  console.log("NFT deployed to:", pandaNft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
