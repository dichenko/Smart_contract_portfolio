import * as dotenv from "dotenv";
import { task } from "hardhat/config";
dotenv.config();

task("mint", "Mint amount of tokens to the owner")
  .addParam("amount", "Amount of tokens to be minted")
  .setAction(async (taskArgs, hre) => {
    const [owner] = await hre.ethers.getSigners();
    const erc20Address = process.env.DEPLOYED_ERC20_ADDRESS;
    const myERC20 = await hre.ethers.getContractAt(
      "MyERC20",
      erc20Address as string,
      owner
    );
    const result = await myERC20.mint(taskArgs.amount);
    console.log(result);
  });
