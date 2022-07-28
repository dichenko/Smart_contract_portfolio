import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import env = require("hardhat");

async function main() {
  let erc20: Contract;
  let deployer: SignerWithAddress;

  [deployer] = await ethers.getSigners();

  //erc20 deploy
  const MyERC20Factory = await ethers.getContractFactory("GovernanceToken");
  erc20 = await MyERC20Factory.deploy();
  erc20.deployed();
  console.log("ERC20 deployed to:", erc20.address);
  console.log("Try to verify contract");
  await new Promise(f => setTimeout(f, 20000));
  try {
    await env.run("verify:verify", {
      address: erc20.address,
      contract: "contracts/GovernanceToken.sol:GovernanceToken",
    });
    console.log("Verifyed");
  } catch (e: any) {
    console.log(e.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
