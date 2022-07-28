import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
dotenv.config();
const stakingABI = require("../abis/Staking.json");

task("deposit", "Deposit tokens to DAO")
  .addParam("amount", "Amount of tokenss")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS as string, owner);
    const governanceToken = await hre.ethers.getContractAt("GovernanceToken", process.env.GOVERNANCE_TOKEN_ADDRESS as string, owner);
    await governanceToken.approve(process.env.DAO_ADDRESS as string, taskArgs.amount);
    await dao.deposit(taskArgs.amount);
  });
