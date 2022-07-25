import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "ethers";
dotenv.config();

task("stake", "Stake lpTokens")
  .addParam("stakingAddress", "Staking contract address")
  .addParam("lpTokenAddress", "LP token address address")
  .addParam("amount", "Amount of LP token to stake")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();

    const stakingContract = await hre.ethers.getContractAt(
      "Staking",
      taskArgs.stakingAddress as string,
      owner
    );

    const lpToken = await hre.ethers.getContractAt(
      "LpToken",
      taskArgs.lpTokenAddress as string,
      owner
    );

    const tx1 = await lpToken.approve(taskArgs.stakingAddress, taskArgs.amount);
    const tx2 = await stakingContract.stake(taskArgs.amount);
    return tx2;
  });
