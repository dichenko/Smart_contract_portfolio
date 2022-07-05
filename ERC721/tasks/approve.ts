import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("approve", "Approve operator to transfer tokenID from owner  ")
  .addParam("operator", "Operator address")
  .addParam("tokenId", "Token ID to approve")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();

    const erc721address = process.env.NFT_CONTRACT_ADDRESS;

    const myERC721 = await hre.ethers.getContractAt(
      "PandaNFT",
      erc721address as string,
      owner
    );

    const result = await myERC721.approve(taskArgs.operator, taskArgs.tokenId);

    console.log(result);
  });
