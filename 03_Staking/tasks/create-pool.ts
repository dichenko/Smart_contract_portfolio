import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "ethers";
dotenv.config();

task("create-pool", "Create a uniswap-v2-poll ETH-ERC20")
  .addParam("ethAmount", "Amount of ETH")
  .addParam("erc20address", "Token address")
  .addParam("tokenAmount", "Amount of ERC20 tokens")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const routerAddress = process.env.UNISWAP_V2_ROUTER02;
    const uniswapRouter = await hre.ethers.getContractAt(
      "IUniswapV2Router02",
      routerAddress as string,
      owner
    );

    const newToken = await hre.ethers.getContractAt(
      "NewToken",
      taskArgs.erc20address as string,
      owner
    );
    const tx0 = await newToken.mint(
      ethers.utils.parseEther(taskArgs.tokenAmount)
    );
    const tx1 = await newToken.approve(
      routerAddress as string,
      ethers.utils.parseEther(taskArgs.tokenAmount)
    );

    const result = await uniswapRouter.addLiquidityETH(
      taskArgs.erc20address as string,
      taskArgs.tokenAmount,
      0,
      0,
      owner.address as string,
      1000000000000,
      { value: taskArgs.ethAmount, gasLimit: 400000 }
    );
    console.log(result);
  });
