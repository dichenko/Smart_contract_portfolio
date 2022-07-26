import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("burn", "Burn amount of tokens from the owner account")
  .addParam("amount", "Amount of tokens to be burned")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const erc20Address = process.env.DEPLOYED_ERC20_ADDRESS;
    const myERC20 = await hre.ethers.getContractAt(
      "MyERC20",
      erc20Address as string,
      owner
    );
    const result = await myERC20.burn(taskArgs.amount);
    console.log(result);
  });
