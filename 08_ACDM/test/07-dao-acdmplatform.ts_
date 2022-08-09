import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "ethers";
const stakingABI = require("../abis/Staking.json");
const acdmPlatformABI = require("../abis/ACDMPlatform.json");

describe("DAO-ACDMPlatform", function () {
  let dao: Contract;
  let acdmPlatform: Contract;
  let lpToken: Contract;
  let rewardToken: Contract;
  let staking: Contract;
  let acdmToken: Contract;

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

    //deploy acdmToken
    const ACDMTFactory = await ethers.getContractFactory("ACDMToken");
    acdmToken = await ACDMTFactory.deploy();
    acdmToken.deployed();

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

    //setup ACDMPlatform
    await acdmPlatform.grantRole(acdmPlatform.DAO(), dao.address);
  });

  it("Proposal should call setSaleRoundReferRewards in ACDM Platform", async function () {
    
    expect(await acdmPlatform.saleRoundReferRewards(0)).to.eq(50);
    expect(await acdmPlatform.saleRoundReferRewards(1)).to.eq(30);

    //Preparing of proposal calldata
    const iface = new ethers.utils.Interface(acdmPlatformABI);
    const calldata = iface.encodeFunctionData("setSaleRoundReferRewards", [80, 10]);

    //add proposal
    await dao.addProposal(acdmPlatform.address, calldata);

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

    await expect(dao.finish(0)).to.emit(dao, "VotingFinished").withArgs(0, 1);

    expect(await acdmPlatform.saleRoundReferRewards(0)).to.eq(80);
    expect(await acdmPlatform.saleRoundReferRewards(1)).to.eq(10);
  });

  it("Proposal should call setTradeRoundReferRewards in ACDM Platform", async function () {
    
    expect(await acdmPlatform.tradeRoundReferRewards(0)).to.eq(25);
    expect(await acdmPlatform.tradeRoundReferRewards(1)).to.eq(25);

    //Preparing of proposal calldata
    const iface = new ethers.utils.Interface(acdmPlatformABI);
    const calldata = iface.encodeFunctionData("setTradeRoundReferRewards", [35, 35]);

    //add proposal
    await dao.addProposal(acdmPlatform.address, calldata);

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

    await expect(dao.finish(0)).to.emit(dao, "VotingFinished").withArgs(0, 1);

    expect(await acdmPlatform.tradeRoundReferRewards(0)).to.eq(35);
    expect(await acdmPlatform.tradeRoundReferRewards(1)).to.eq(35);
  });


});
