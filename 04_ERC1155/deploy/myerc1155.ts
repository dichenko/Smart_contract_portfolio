import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  let myERC1155: Contract;
  let owner: SignerWithAddress;

  [owner] = await ethers.getSigners();
  const NftFactory = await ethers.getContractFactory("MyERC1155");
  myERC1155 = await NftFactory.deploy();
  myERC1155.deployed();

  console.log("NFT deployed to:", myERC1155.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
