import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
dotenv.config();
const stakingABI = require("../abis/Staking.json");

task("add-proposal", "Add proposal")
  .addParam("recipient", "Recipient address")
  .addParam("method", "Called method")
  .addParam("percent", "Percent value")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS as string, owner);

    const iface = new hre.ethers.utils.Interface(stakingABI);
    const calldata = iface.encodeFunctionData(taskArgs.method, [taskArgs.percent]);

    await dao.addProposal(taskArgs.recipient, calldata);
  });
