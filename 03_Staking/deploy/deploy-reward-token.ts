import { ethers } from "hardhat";


async function main() {
 
 
 ///deploy reward token

 let name = "RewardToken";
 let symbols = "RWD";
 let decimals = 18;
 let initialSupply = ethers.utils.parseEther("100000000");


 const [deployer] = await ethers.getSigners();

 const rewardTokenFactory = await ethers.getContractFactory("RewardToken");
 let rewardToken = await rewardTokenFactory.deploy(name, symbols, decimals, initialSupply);
 await rewardToken.deployed();
 
 console.log("rewardToken deployed to:", rewardToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
