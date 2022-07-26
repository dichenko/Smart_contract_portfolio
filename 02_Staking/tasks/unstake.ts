import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "ethers";
dotenv.config();

task("unstake", "Unstake lpTokens")
  .addParam("stakingAddress", "Staking contract address")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();

    const stakingContract = await hre.ethers.getContractAt(
      "Staking",
      taskArgs.stakingAddress as string,
      owner
    );

    const tx = await stakingContract.unstake();
    return tx;
  });
