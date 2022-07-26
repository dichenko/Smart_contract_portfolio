import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task("transfer", "Transfer amount of tokens to another address")
.addParam("to", "Address to transfer")
  .addParam("amount", "Amount of tokens to transfer")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const erc20Address = process.env.DEPLOYED_ERC20_ADDRESS;
    const myERC20 = await hre.ethers.getContractAt(
      "MyERC20",
      erc20Address as string,
      owner
    );
    const result = await myERC20.transfer(taskArgs.to, taskArgs.amount);
    console.log(result);
  });
