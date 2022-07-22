import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("swap", "Swap amount of token")
  .addParam("recipient", "Recipient address")
  .addParam("chainId", "Chain ID to transfer tokens")
  .addParam("amount", "amount of tokens")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();

    const bridgeAddress = process.env.BRIDGE_CONTRACT_ADDRESS;

    const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddress as string, owner);

    let result = await bridge.swap(taskArgs.recipient, taskArgs.chainId, taskArgs.amount);
    
  });
