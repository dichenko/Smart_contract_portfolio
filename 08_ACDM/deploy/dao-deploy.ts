import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import env = require("hardhat");
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  let dao: Contract;

  let deployer: SignerWithAddress;

  [deployer] = await ethers.getSigners();

  const DAOFactory = await ethers.getContractFactory("DAO");
  dao = await DAOFactory.deploy(process.env.GOVERNANCE_TOKEN_ADDRESS as string);
  dao.deployed();
  console.log("DAO deployed to:", dao.address);

  console.log("Try to verify contract");

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
