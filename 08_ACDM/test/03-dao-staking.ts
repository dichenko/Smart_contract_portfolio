import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
const stakingABI = require("../abis/Staking.json");

describe("DAO - Staking", function () {
  let dao: Contract;
  let lpToken: Contract;
  let rewardToken: Contract;
  let staking: Contract;


  let deployer: SignerWithAddress;

  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;

  beforeEach(async () => {
    [deployer, user1, user2, user3] = await ethers.getSigners();

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
  });

  describe("DAO: Staking contract management", function () {
  
    it("Proposal should call staking contract after voting", async function () {
      expect(await staking.timeToLockLp()).to.eq(5*24*60*60);

      //Preparing of proposal calldata
      const iface = new ethers.utils.Interface(stakingABI);
      const calldata = iface.encodeFunctionData("setTimeToLockLp", [1*24*60*60]);

      //add proposal 
      await dao.addProposal(staking.address, calldata);

      //vote
      await staking.connect(user1).stake(ethers.utils.parseEther("1"));
      await dao.connect(user1).vote(0, 1);
      await staking.connect(user2).stake(ethers.utils.parseEther("1"));
      await dao.connect(user2).vote(0, 1);
      await staking.connect(user3).stake(ethers.utils.parseEther("1"));
      await dao.connect(user3).vote(0, 1);

      //wait for debate period is up
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      expect(await dao.finish(0))
        .to.emit(dao, "VotingFinished")
        .withArgs(0, 1);

        expect(await staking.timeToLockLp()).to.eq(1*24*60*60);
    });

    it("Proposal should not call staking if voting is negative ", async function () {
      expect(await staking.timeToLockLp()).to.eq(5*24*60*60);

      //Preparing of proposal calldata
      const iface = new ethers.utils.Interface(stakingABI);
      const calldata = iface.encodeFunctionData("setTimeToLockLp", [1*24*60*60]);

      //add proposal 
      await dao.addProposal(staking.address, calldata);

      //vote
      await staking.connect(user1).stake(ethers.utils.parseEther("1"));
      await dao.connect(user1).vote(0, 1);
      await staking.connect(user2).stake(ethers.utils.parseEther("1"));
      await dao.connect(user2).vote(0, 0);
      await staking.connect(user3).stake(ethers.utils.parseEther("1"));
      await dao.connect(user3).vote(0, 0);

      //wait for debate period is up
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      expect(await dao.finish(0))
        .to.emit(dao, "VotingFinished")
        .withArgs(0, 0);

        expect(await staking.timeToLockLp()).to.eq(5*24*60*60);
    });

    it("Should revert if signature is invalid", async function () {
      expect(await staking.timeToLockLp()).to.eq(5*24*60*60);

      //add proposal with invalid calldata
      await dao.addProposal(staking.address, "0x");

      //vote
      await staking.connect(user1).stake(ethers.utils.parseEther("1"));
      await dao.connect(user1).vote(0, 1);
      await staking.connect(user2).stake(ethers.utils.parseEther("1"));
      await dao.connect(user2).vote(0, 1);
      await staking.connect(user3).stake(ethers.utils.parseEther("1"));
      await dao.connect(user3).vote(0, 1);

      //wait for debate period is up
      let debatePeriod = Number(await dao.debatePeriod());
      await network.provider.send("evm_increaseTime", [debatePeriod]);

      await expect(dao.finish(0)).to.revertedWith("Incorrect signature");

      expect(await staking.timeToLockLp()).to.eq(5*24*60*60);
    });

  });



  
});
