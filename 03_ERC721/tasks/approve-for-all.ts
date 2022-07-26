import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("setapprovalforall", "Approve operator to transfer all tokens from owner  ")
  .addParam("operator", "Operator address").addParam("bool", "True or false")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();

    const erc721address = process.env.NFT_CONTRACT_ADDRESS;

    const myERC721 = await hre.ethers.getContractAt(
      "PandaNFT",
      erc721address as string,
      owner
    );

    const result = await myERC721.setApprovalForAll(taskArgs.operator, taskArgs.bool);

    console.log(result);
  });
