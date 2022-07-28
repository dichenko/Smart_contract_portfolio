import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
dotenv.config();
const stakingABI = require("../abis/Staking.json");

task("finish", "Finish voting after debate time")
  .addParam("id", "ID of voting")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const dao = await hre.ethers.getContractAt("DAO", process.env.DAO_ADDRESS as string, owner);
    await dao.finish(taskArgs.id);
  });
