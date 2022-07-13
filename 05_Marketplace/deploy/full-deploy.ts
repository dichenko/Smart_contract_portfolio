import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

async function main() {
  let marketplace: Contract;
  let myERC20: Contract;
  let myERC721: Contract;
  let myERC1155: Contract;
  let owner: SignerWithAddress;
  [owner] = await ethers.getSigners();
  
  //erc20 deploy
  const MyERC20Factory = await ethers.getContractFactory("Marketplace");
  myERC20 = await MyERC20Factory.deploy("MarketplaseTokens", "MPT", 18, ethers.utils.parseEther("10000000000"));
  myERC20.deployed();
  console.log("ERC20 deployed to:", myERC20.address);

  //erc721 deploy
  const MyERC721Factory = await ethers.getContractFactory("MyERC721");
  myERC721 = await MyERC721Factory.deploy();
  myERC721.deployed();
  console.log("ERC721deployed to:", myERC721.address);

  //erc1155 deploy
  const MyERC1155Factory = await ethers.getContractFactory("MyERC1155");
  myERC1155 = await MyERC1155Factory.deploy();
  myERC1155.deployed();
  console.log("ERC1155deployed to:", myERC1155.address);

  //marketplace deploy
  const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
  marketplace = await MarketplaceFactory.deploy(myERC20.address, myERC721.address, myERC1155.address, owner.address);
  marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);

  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
