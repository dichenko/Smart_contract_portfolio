import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("mint", "Mint new nft")
  .addParam("recipient", "Recipient address")
  .addParam("tokenURI", "link to URI json")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const erc721address = process.env.NFT_CONTRACT_ADDRESS;
    const myERC721 = await hre.ethers.getContractAt(
      "PandaNFT",
      erc721address as string,
      owner
    );
    const result = await myERC721.mint(taskArgs.recipient, taskArgs.tokenURI);
    console.log(result);
  });
