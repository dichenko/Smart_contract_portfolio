import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import env = require("hardhat");
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
 
  console.log("Try to verify contract");

  try {
    await env.run("verify:verify", {
      address: process.env.DAO_ADDRESS as string,
      contract: "contracts/DAO.sol:DAO",
      constructorArguments:[
        process.env.GOVERNANCE_TOKEN_ADDRESS as string
      ]
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
