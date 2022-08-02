import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

describe("Staking", function () {
  let dao: Contract;
  let lpToken: Contract;
  let rewardToken: Contract;
  let staking: Contract;
  let deployer: SignerWithAddress;
  let chairman: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [deployer, chairman, user1, user2, user3] = await ethers.getSigners();

    //deploy lpToken
    const LPFactory = await ethers.getContractFactory("LPToken");
    lpToken = await LPFactory.deploy();
    lpToken.deployed();

    //deploy reward token
    const REWARDFactory = await ethers.getContractFactory("XXXToken");
    rewardToken = await REWARDFactory.deploy();
    rewardToken.deployed();

    //deploy Staking Contract
    const StakingFactory = await ethers.getContractFactory("Staking");
    staking = await StakingFactory.deploy(lpToken.address, rewardToken.address);
    staking.deployed();

    //deploy DAO Contract
    const DAOFactory = await ethers.getContractFactory("DAO");
    dao = await DAOFactory.deploy(lpToken.address);
    dao.deployed();

    //grantRoles
    await staking.grantRole(staking.DAO(), dao.address);

    //deposit lp-tokens for users
    await lpToken.mint(user1.address, ethers.utils.parseEther("1"));
    await lpToken.mint(user2.address, ethers.utils.parseEther("1"));
    await lpToken.mint(user3.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user1).approve(staking.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user2).approve(staking.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user3).approve(staking.address, ethers.utils.parseEther("1"));

    //deposit reward tokens for staking contract
    await rewardToken.mint(staking.address, ethers.utils.parseEther("1"));

    //setup staking
    await staking.setupDao(dao.address);

    //setup dao
    await dao.setupStaking(staking.address);
  });

  describe("Deployment", function () {
    it("Should set correct values", async function () {
      expect(await staking.rewardPercent()).to.eq(3);
      expect(await staking.timeToLockLp()).to.eq(5 * 24 * 60 * 60);
    });

    it("Should not change DAO address", async function () {
      await expect(staking.setupDao(dao.address)).to.revertedWith("Dao already setted");
    });
  });

  describe("Stake", function () {
    it("Should emit Staked event", async function () {
      expect(await staking.connect(user1).stake(10000))
        .to.emit(staking, "Staked")
        .withArgs(user1.address, 10000);
    });

    it("Should change stakingValue", async function () {
      await staking.connect(user1).stake(11000);
      expect(await staking.stakingValue()).to.eq(11000);
      await staking.connect(user2).stake(3000);
      expect(await staking.stakingValue()).to.eq(11000 + 3000);
    });

    it("Should change stakeAmount", async function () {
      await staking.connect(user1).stake(11000);
      expect(await staking.stakeAmount(user1.address)).to.eq(11000);
      await staking.connect(user1).stake(5000);
      expect(await staking.stakeAmount(user1.address)).to.eq(11000 + 5000);
      await staking.connect(user2).stake(3000);
      expect(await staking.stakeAmount(user2.address)).to.eq(3000);
    });
  });

  describe("Unstake", function () {
    it("Should not unstake before lock time is up", async function () {
      await staking.connect(user3).stake(800);
      await expect(staking.connect(user3).unstake()).to.be.revertedWith("Time lock");
    });

    it("Should not unstake before debate time is up", async function () {
      await staking.connect(user3).stake(800);
      let timeToLockLp = Number(await staking.timeToLockLp());
      await network.provider.send("evm_increaseTime", [timeToLockLp]);
      await dao.addProposal(staking.address, "0x");
      await dao.connect(user3).vote(0, 1);
      await expect(staking.connect(user3).unstake()).to.be.revertedWith(
        "Wait for debate period is up"
      );
    });

    it("Should unstake correctly", async function () {
      await staking.connect(user1).stake(2800);
      await staking.connect(user2).stake(1500);
      let timeToLockLp = Number(await staking.timeToLockLp());

      await network.provider.send("evm_increaseTime", [timeToLockLp]);

      await dao.addProposal(staking.address, "0x");
      await dao.connect(user1).vote(0, 1);
      await dao.connect(user2).vote(0, 1);
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      await expect(() => staking.connect(user1).unstake()).to.changeTokenBalances(
        lpToken,
        [staking, user1],
        [-2800, 2800]
      );

      await expect(() => staking.connect(user2).unstake()).to.changeTokenBalances(
        lpToken,
        [staking, user2],
        [-1500, 1500]
      );
    });

    it("Should emit Unstaked event", async function () {
      await staking.connect(user1).stake(2800);
      let timeToLockLp = Number(await staking.timeToLockLp());
      await network.provider.send("evm_increaseTime", [timeToLockLp]);
      await dao.addProposal(staking.address, "0x");
      await dao.connect(user1).vote(0, 1);
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);
      expect(await staking.connect(user1).unstake())
        .to.emit(staking, "Unstaked")
        .withArgs(user1.address, 2800);
    });
  });

  describe("Claim", function () {
    it("Should update token balances after claim", async function () {
      await staking.connect(user1).stake(100);
      await staking.connect(user2).stake(100);

      await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);

      await expect(() => staking.connect(user1).claim()).to.changeTokenBalances(
        rewardToken,
        [staking, user1],
        [-3, 3]
      );

      await network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);

      await expect(() => staking.connect(user1).claim()).to.changeTokenBalances(
        rewardToken,
        [staking, user1],
        [-3, 3]
      );

      await expect(() => staking.connect(user2).claim()).to.changeTokenBalances(
        rewardToken,
        [staking, user2],
        [-6, 6]
      );
    });

    it("Should wait at least 1 week to claim", async function () {
      await staking.connect(user1).stake(100);

      await network.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]);

      await expect(staking.connect(user1).claim()).to.revertedWith("Wait for 1 week");
    });

    it("Should reset time counter after new stake", async function () {
      await staking.connect(user1).stake(100);
      await network.provider.send("evm_increaseTime", [1 * 24 * 60 * 60]);
      await staking.connect(user1).stake(100);
      await network.provider.send("evm_increaseTime", [6 * 24 * 60 * 60]);
      await expect(staking.connect(user1).claim()).to.revertedWith("Wait for 1 week");
    });
  });
});

// let debatePeriod = Number(await dao.debatePeriod());
// await network.provider.send("evm_increaseTime", [debatePeriod]);
//emit Unstaked(msg.sender, _amount);
