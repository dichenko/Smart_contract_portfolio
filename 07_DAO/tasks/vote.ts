import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
dotenv.config();
const stakingABI = require("../abis/Staking.json");

task("vote", "Vote")
  .addParam("id", "ID of voting").addParam("option", "Option 1-pro, 0-contra")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS as string, owner);
    await dao.vote(taskArgs.id, taskArgs.option);
  });
