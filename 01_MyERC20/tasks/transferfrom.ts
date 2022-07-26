import * as dotenv from "dotenv";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
dotenv.config();

task(
  "transferfrom",
  "Transfers amount of tokens from address from to address to"
)
  .addParam("from", "Address from transfer")
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
    const result = await myERC20.transferFrom(
      taskArgs.from,
      taskArgs.to,
      taskArgs.amount
    );
    console.log(result);
  });
