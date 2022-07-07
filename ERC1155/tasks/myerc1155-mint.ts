import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("mint", "Mint amount of NFT wits existing ID")
  .addParam("recipient", "Recipient address").addParam("id", "NFT id")
  .addParam("amount", "Amount to mint")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const erc1155address = process.env.NFT_CONTRACT_ADDRESS;
    const myERC1155 = await hre.ethers.getContractAt(
      "MyERC1155",
      erc1155address as string,
      owner
    );
    const result = await myERC1155.mint(taskArgs.recipient, taskArgs.id, taskArgs.amount, "0x12");
    console.log(result);
  });
