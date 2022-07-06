import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("transfer", "Transfer tokenID from caller to recipient").addParam("owner", "Owner address")
  .addParam("recipient", "Recipient address")
  .addParam("tokenId", "link to URI json")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const erc721address = process.env.NFT_CONTRACT_ADDRESS;
    const myERC721 = await hre.ethers.getContractAt(
      "PandaNFT",
      erc721address as string,
      owner
    );
    const result = await myERC721.transferFrom(taskArgs.owner, taskArgs.recipient, taskArgs.tokenId);
    console.log(result);
  });
