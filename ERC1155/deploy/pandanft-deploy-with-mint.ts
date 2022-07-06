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

  const mint1 = await pandaNft.mint(owner.address, process.env.URI01);
  mint1.wait();
  const mint2 = await pandaNft.mint(owner.address, process.env.URI02);
  mint2.wait();
  const mint3 = await pandaNft.mint(owner.address, process.env.URI03);
  mint3.wait();
  const mint4 = await pandaNft.mint(owner.address, process.env.URI04);
  mint4.wait();
  const mint5 = await pandaNft.mint(owner.address, process.env.URI05);
  mint5.wait();
  const mint6 = await pandaNft.mint(owner.address, process.env.URI06);
  mint6.wait();
  const mint7 = await pandaNft.mint(owner.address, process.env.URI07);
  mint7.wait();
  const mint8 = await pandaNft.mint(owner.address, process.env.URI08);
  mint8.wait();

  console.log("Minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
