import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("redeam", "Redeam tokens")
  .addParam("initiator", "Initiator address")
  .addParam("recipient", "Recipient address")
  .addParam("amount", "Amount of tokens")
  .addParam("nonce", "Nonce of transaction")
  .addParam("v", "v fron signature")
  .addParam("r", "r fron signature")
  .addParam("s", "s fron signature")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();

    const bridgeAddress = process.env.BRIDGE_CONTRACT_ADDRESS;
    const bridge = await hre.ethers.getContractAt("Bridge", bridgeAddress as string, owner);
    let result = await bridge.redeam(
      taskArgs.initiator,
      taskArgs.recipient,
      taskArgs.amount,
      taskArgs.nonce,
      taskArgs.v,
      taskArgs.r,
      taskArgs.s
    );
  });
