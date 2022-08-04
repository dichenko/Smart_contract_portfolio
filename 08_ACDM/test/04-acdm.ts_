import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";

describe("ACDM Platform", function () {
  let dao: Contract;
  let lpToken: Contract;
  let rewardToken: Contract;
  let staking: Contract;
  let acdmPlatform: Contract;
  let acdmToken: Contract;
  let deployer: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();

    //deploy acdmToken
    const ACDMTFactory = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMTFactory.deploy();
    acdmToken.deployed();

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

    //deploy ACDM Platform Contract
    const ACDMFactory = await ethers.getContractFactory("ACDMPlatform");
    acdmPlatform = await ACDMFactory.deploy(acdmToken.address);
    await acdmPlatform.deployed();

    //deposit lp-tokens for users
    await lpToken.mint(user1.address, ethers.utils.parseEther("1"));
    await lpToken.mint(user2.address, ethers.utils.parseEther("1"));
    await lpToken.mint(user3.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user1).approve(staking.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user2).approve(staking.address, ethers.utils.parseEther("1"));
    await lpToken.connect(user3).approve(staking.address, ethers.utils.parseEther("1"));

    //deposit reward tokens for staking contract
    await rewardToken.mint(staking.address, ethers.utils.parseEther("1"));

    //setup staking to be managed by the DAO
    await staking.setupDao(dao.address);

    //setup dao
    await dao.setupStaking(staking.address);

    //grant role MINTER_BURNER
    await acdmToken.grantRole(acdmToken.MINTER_BURNER(), acdmPlatform.address);
  });

  describe("Deploy", function () {
    it("Inicial ststus should be 'Pending'", async function () {
      expect(await acdmPlatform.status()).to.eq(0);
    });
  });

  describe("User registration", function () {
    it("Should registrate correctly", async function () {
      await expect(acdmPlatform.connect(user1).register(user3.address)).to.revertedWith(
        "Reffer not registered"
      );
      await acdmPlatform.connect(user1).register(deployer.address);
      await acdmPlatform.connect(user2).register(user1.address);
      await acdmPlatform.connect(user3).register(user2.address);
      expect(await acdmPlatform.registered(user1.address)).to.eq(true);
    });
  });

  describe("Platform starting", function () {
    it("Only admin can start platform", async function () {
      await expect(acdmPlatform.connect(user1).startPlatform()).to.reverted;
    });

    it("Should set correct values after starting", async function () {
      await acdmPlatform.connect(deployer).startPlatform();
      expect(await acdmToken.totalSupply()).to.eq(100000 * 10 ** 6);
      expect(await acdmPlatform.status()).to.eq(1);
    });
  });

});
