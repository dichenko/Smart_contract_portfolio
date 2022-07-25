import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "ethers";
dotenv.config();

task("claim", "Claim reward tokens").addParam("address", "Staking contract address").setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    
    const stakingContract = await hre.ethers.getContractAt(
      "Staking",
      taskArgs.address as string,
      owner
    );
    
    const tx = await stakingContract.claim();
    return tx;
});