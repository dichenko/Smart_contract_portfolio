import { ethers } from "hardhat";

async function main() {
  
  ///deploy staking contract
  const [deployer] = await ethers.getSigners();
  const MyStakingFactory = await ethers.getContractFactory("Staking");
  const myStaking = await MyStakingFactory.deploy(
    process.env.LP_TOKEN_ADDRESS,
    process.env.REWATD_TOKENADDRESS
  );

  await myStaking.deployed();

  console.log("MyStaking deployed to:", myStaking.address);

  ///transfer Reward Tokens to staking contract
  let rewardToken = await ethers.getContractAt(
    "RewardToken",
    REWATDTOKENADDRESS,
    deployer
  );

  let tx0 = await rewardToken.mint(ethers.utils.parseEther("100000"));
  let tx1 = await rewardToken.transfer(myStaking.address, ethers.utils.parseEther("100000"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
