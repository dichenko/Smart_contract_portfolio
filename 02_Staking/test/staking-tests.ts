import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("MyStaking", function () {
  let name = "RewardToken";
  let symbols = "RWD";
  let decimals = 18;
  let initialSupply = ethers.utils.parseEther("1000");

  let lpToken: Contract;
  let myStaking: Contract;
  let rewardToken: Contract;

  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    const LpTokenFactory = await ethers.getContractFactory("LpToken");
    lpToken = await LpTokenFactory.deploy(
      "LpToken",
      "LPT",
      decimals,
      initialSupply
    );
    await lpToken.deployed();

    const RewardTokenFactory = await ethers.getContractFactory("RewardToken");
    rewardToken = await RewardTokenFactory.deploy(
      "RewardToken",
      "RWD",
      decimals,
      initialSupply
    );
    await rewardToken.deployed();

    const MyStakingFactory = await ethers.getContractFactory("Staking");
    myStaking = await MyStakingFactory.deploy(
      lpToken.address,
      rewardToken.address
    );
    await myStaking.deployed();

    [owner, user1, user2] = await ethers.getSigners();

    lpToken.transfer(user1.address, ethers.utils.parseEther("10"));
    lpToken.transfer(user2.address, ethers.utils.parseEther("10"));
    lpToken
      .connect(user1)
      .approve(myStaking.address, ethers.utils.parseEther("10"));
    lpToken
      .connect(user2)
      .approve(myStaking.address, ethers.utils.parseEther("10"));

    rewardToken.transfer(myStaking.address, ethers.utils.parseEther("100"));
  });

  describe("Deploy", function () {
    it("Should set correct owner", async function () {
      expect(await myStaking.owner()).to.equal(owner.address);
    });
  });

  describe("Staking", function () {
    it("Should set correct lpToken balance after staking", async function () {
      let balanceBefore = await lpToken.balanceOf(myStaking.address);
      let tx0 = await myStaking.connect(user1).stake(1000);
      expect(await lpToken.balanceOf(myStaking.address)).to.equal(
        balanceBefore.add(1000)
      );
    });

    it("Should emit event 'Staked'", async function () {
      await expect(myStaking.connect(user1).stake(1000))
        .to.emit(myStaking, "Staked")
        .withArgs(user1.address, 1000);
    });
  });

  describe("Unstaking", function () {
    it("Should restrict unstaking before lockup time is up", async function () {
      let tx1 = await myStaking.connect(user1).stake(1000);
      tx1.wait();
      await expect(myStaking.connect(user1).unstake()).to.be.revertedWith(
        "Time lock"
      );
    });

    it("Should unstake when lock time is up", async function () {
      let lockTime = Number(await myStaking.timeToLockLp());
      let tx1 = await myStaking.connect(user1).stake(1000);
      let lpTokenBalanseBefore = await lpToken.balanceOf(user1.address);
      await network.provider.send("evm_increaseTime", [lockTime]);
      let tx2 = await myStaking.connect(user1).unstake();
      expect(await lpToken.balanceOf(user1.address)).to.equal(
        lpTokenBalanseBefore.add(1000)
      );
    });
  });

  describe("Claim", function () {
    it("Should falied claim reward before lock time is up", async function () {
      let tx1 = await myStaking.connect(user1).stake(1000);
      tx1.wait();
      await expect(myStaking.connect(user1).claim()).to.be.revertedWith(
        "Time lock"
      );
    });

    it("Should claim when lock time is up", async function () {
      let lockTime = Number(await myStaking.timeToLockReward());
      let percent = await myStaking.percent();
      let decimals = await myStaking.percentDecimals();
      let tx1 = await myStaking.connect(user1).stake(1000);
      await network.provider.send("evm_increaseTime", [lockTime]);
      let tx2 = await myStaking.connect(user1).claim();
      expect(await rewardToken.balanceOf(user1.address)).to.equal(
        (percent * 1000) / 100**decimals
      );
    });
  });

  describe("Utils", function () {
    it("Should fail setting variables except owner", async function () {
      await expect(myStaking.connect(user1).setPercent(1)).to.be.revertedWith(
        "You a not an owner!"
      );
      await expect(
        myStaking.connect(user1).setTimeToLockReward(1)
      ).to.be.revertedWith("You a not an owner!");
      await expect(
        myStaking.connect(user1).setTimeToLockLp(1)
      ).to.be.revertedWith("You a not an owner!");
    });

    it("Should set variables correctly by owner", async function () {
      const tx1 = await myStaking.setPercent(1);
      const tx2 = await myStaking.setTimeToLockReward(1);
      const tx3 = await myStaking.setTimeToLockLp(1);
      expect(await myStaking.percent()).to.equal(1);
      expect(await myStaking.timeToLockReward()).to.equal(1);
      expect(await myStaking.tvimeToLockLp()).to.equal(1);
    });
  });
});
