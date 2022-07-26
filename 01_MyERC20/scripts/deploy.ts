import { ethers } from "hardhat";

async function main() {

  let name = "RewardToken";
  let symbols = "RWD";
  let decimals = 18;
  let initialSupply = ethers.utils.parseEther("1000000");

  const MyTokenFactory = await ethers.getContractFactory("MyERC20");
  const myToken = await MyTokenFactory.deploy(name, symbols, decimals, initialSupply);
  await myToken.deployed();
  
  console.log("MyToken deployed to:", myToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });